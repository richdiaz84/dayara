
    import React, { useState, useEffect } from 'react';
    import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useCurrency } from '@/contexts/CurrencyContext';

    const PayPalCheckoutButton = ({ cartDetails, orderDetails, onPaymentSuccess, onPaymentError, onPaymentCancel }) => {
      const [paypalClientId, setPaypalClientId] = useState(null);
      const [loadingClientId, setLoadingClientId] = useState(true);
      const { toast } = useToast();
      const { currencyCode, loadingSettings: loadingCurrencySettings } = useCurrency();

      useEffect(() => {
        const fetchClientId = async () => {
          setLoadingClientId(true);
          try {
            const { data, error } = await supabase.functions.invoke('get-paypal-client-id');
            if (error) throw error;
            if (data && data.clientId) {
              setPaypalClientId(data.clientId);
            } else {
              throw new Error('Client ID no recibido de la función.');
            }
          } catch (error) {
            console.error('Error fetching PayPal Client ID:', error);
            toast({ variant: "destructive", title: "Error de PayPal", description: `No se pudo obtener el ID de cliente de PayPal: ${error.message}` });
            if (onPaymentError) onPaymentError("Error de configuración de PayPal.");
          } finally {
            setLoadingClientId(false);
          }
        };
        fetchClientId();
      }, [toast, onPaymentError]);

      const createOrder = async (data, actions) => {
        if (loadingCurrencySettings || !currencyCode) {
            toast({ variant: "destructive", title: "Error", description: "Configuración de moneda no cargada."});
            throw new Error("Configuración de moneda no cargada.");
        }
        try {
          const { data: orderData, error } = await supabase.functions.invoke('create-paypal-order', {
            body: {
              cart: cartDetails.items.map(item => ({
                id: item.product_id,
                quantity: item.quantity,
                name: item.name,
                unit_amount: item.price 
              })),
              totalAmount: cartDetails.total,
              currency_code: currencyCode 
            }
          });
          if (error) {
            console.error('Error creating PayPal order via Supabase function:', error);
            throw new Error(`Error al crear orden en PayPal: ${error.message || error}`);
          }
          if (!orderData || !orderData.id) {
            console.error('Respuesta inválida de create-paypal-order:', orderData);
            throw new Error('Respuesta inválida al crear orden en PayPal.');
          }
          return orderData.id;
        } catch (err) {
          console.error('Error en createOrder:', err);
          toast({ variant: "destructive", title: "Error de PayPal", description: `No se pudo crear la orden de PayPal: ${err.message}` });
          if (onPaymentError) onPaymentError(`No se pudo crear la orden de PayPal: ${err.message}`);
          throw err; 
        }
      };

      const onApprove = async (data, actions) => {
        try {
          const { data: captureData, error } = await supabase.functions.invoke('capture-paypal-order', {
            body: { orderID: data.orderID }
          });

          if (error) {
            console.error('Error capturing PayPal order via Supabase function:', error);
            throw new Error(`Error al capturar el pago: ${error.message || error}`);
          }
          
          if (captureData && (captureData.status === 'COMPLETED' || captureData.id)) {
            toast({ title: "Pago Exitoso", description: "Tu pago ha sido procesado correctamente." });
            if (onPaymentSuccess) onPaymentSuccess({ 
              paymentId: captureData.id || data.orderID, 
              payerId: data.payerID, 
              paymentSource: 'paypal',
              details: captureData 
            });
          } else {
            console.error('Respuesta inválida o pago no completado:', captureData);
            throw new Error('El pago no se completó o la respuesta fue inválida.');
          }
        } catch (err) {
          console.error('Error en onApprove:', err);
          toast({ variant: "destructive", title: "Error de Pago", description: `No se pudo procesar el pago: ${err.message}` });
          if (onPaymentError) onPaymentError(`No se pudo procesar el pago: ${err.message}`);
        }
      };

      const onError = (err) => {
        console.error('PayPal SDK Error:', err);
        toast({ variant: "destructive", title: "Error de PayPal", description: "Ocurrió un error con PayPal. Por favor, intenta de nuevo." });
        if (onPaymentError) onPaymentError("Error de PayPal SDK.");
      };

      const onCancelClick = () => {
        toast({ variant: "warning", title: "Pago Cancelado", description: "Has cancelado el proceso de pago." });
        if (onPaymentCancel) onPaymentCancel();
      };

      if (loadingClientId || loadingCurrencySettings) {
        return <div className="text-center py-4 text-muted-foreground">Cargando PayPal...</div>;
      }

      if (!paypalClientId) {
        return <div className="text-center py-4 text-red-500">Error al cargar PayPal. Intenta recargar la página.</div>;
      }
      
      if (!currencyCode) {
        return <div className="text-center py-4 text-red-500">Error: Código de moneda no disponible.</div>;
      }

      return (
        <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: currencyCode, intent: "capture" }}>
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancelClick}
            disabled={!cartDetails || cartDetails.items.length === 0 || cartDetails.total <= 0}
          />
        </PayPalScriptProvider>
      );
    };

    export default PayPalCheckoutButton;
  