
    import React, { useState, useEffect } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { useCart } from '@/contexts/CartContext';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft, Info } from 'lucide-react';
    import { motion } from 'framer-motion';
    import CheckoutForm from '@/components/checkout/CheckoutForm';
    import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
    import CheckoutUserPrompt from '@/components/checkout/CheckoutUserPrompt';
    import CheckoutPaymentMethods from '@/components/checkout/CheckoutPaymentMethods';
    import { useCheckout } from '@/hooks/useCheckout';

    const CheckoutPage = () => {
      const { user } = useAuth();
      const { cartItems, cartTotal, cartCount } = useCart();
      const { toast } = useToast();
      const navigate = useNavigate();
      const { isSubmitting, processPayPalOrder, processSimulatedPayment, setIsSubmitting: setCheckoutSubmitting } = useCheckout();

      const initialAddressState = { street: '', city: '', state: '', zip: '', country: 'MX', phone: '', fullName: '' };
      const [shippingAddress, setShippingAddress] = useState(initialAddressState);
      const [billingAddress, setBillingAddress] = useState(initialAddressState);
      const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
      const [useShippingForBilling, setUseShippingForBilling] = useState(true);
      const [orderNotes, setOrderNotes] = useState('');
      const [acceptsMarketing, setAcceptsMarketing] = useState(false);
      const [paymentMethod, setPaymentMethod] = useState('paypal'); 

      const shippingCost = cartTotal > 500 ? 0 : 99; 
      const taxRate = 0.16; 
      const taxes = cartTotal * taxRate;
      const orderTotal = cartTotal + shippingCost + taxes;
      
      const getCurrentOrderDetails = () => {
        const currentCustomerName = user ? (shippingAddress.fullName || customerInfo.name) : customerInfo.name;
        const currentCustomerEmail = user ? (user.email || customerInfo.email) : customerInfo.email;
        const finalBillingAddress = useShippingForBilling ? shippingAddress : billingAddress;

        return {
          user_id: user ? user.id : null,
          customer_name: currentCustomerName,
          customer_email: currentCustomerEmail,
          shipping_address_street: shippingAddress.street,
          shipping_address_city: shippingAddress.city,
          shipping_address_state: shippingAddress.state,
          shipping_address_zip: shippingAddress.zip,
          shipping_address_country: shippingAddress.country,
          shipping_address_phone: shippingAddress.phone,
          billing_address_street: finalBillingAddress.street,
          billing_address_city: finalBillingAddress.city,
          billing_address_state: finalBillingAddress.state,
          billing_address_zip: finalBillingAddress.zip,
          billing_address_country: finalBillingAddress.country,
          billing_address_phone: finalBillingAddress.phone,
          notes: orderNotes,
          subtotal: cartTotal,
          shipping_cost: shippingCost,
          tax_amount: taxes,
          discount_amount: 0, 
          total: orderTotal,
          accepts_marketing: acceptsMarketing,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            images: item.images, 
          })),
        };
      };

      useEffect(() => {
        if (user) {
          const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          setCustomerInfo({ name: userName, email: user.email || '' });
          setShippingAddress(prev => ({ ...prev, fullName: userName }));
          setBillingAddress(prev => ({ ...prev, fullName: userName }));
        }
      }, [user]);

      const validateForm = () => {
        const details = getCurrentOrderDetails();
        if (!details.customer_name || !details.customer_email) {
          toast({ variant: "destructive", title: "Información Requerida", description: "Por favor, ingresa tu nombre y correo electrónico." });
          return false;
        }
        if (!details.shipping_address_street || !details.shipping_address_city || !details.shipping_address_zip || !details.shipping_address_country) {
            toast({ variant: "destructive", title: "Dirección de Envío Incompleta", description: "Completa todos los campos de la dirección de envío." });
            return false;
        }
        if (!useShippingForBilling && (!details.billing_address_street || !details.billing_address_city || !details.billing_address_zip || !details.billing_address_country)) {
            toast({ variant: "destructive", title: "Dirección de Facturación Incompleta", description: "Completa todos los campos de la dirección de facturación." });
            return false;
        }
        return true;
      };

      const handlePayPalSuccess = (payPalTransactionId, payPalOrderDetails) => {
        const orderData = getCurrentOrderDetails();
        processPayPalOrder(orderData, payPalTransactionId, payPalOrderDetails);
      };

      const handlePayPalError = (errorMessage) => {
        setCheckoutSubmitting(false);
      };
      
      const handleSimulatedPayment = async () => {
        if (!validateForm()) return;
        const orderData = getCurrentOrderDetails();
        processSimulatedPayment(orderData);
      };


      if (cartItems.length === 0 && !isSubmitting) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <Info className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-semibold mb-3">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-6">Añade productos a tu carrito antes de proceder al pago.</p>
            <Button asChild><Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Productos</Link></Button>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8 md:py-12"
        >
          <Button variant="outline" onClick={() => navigate('/cart')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Carrito
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Finalizar Compra</h1>

          {!user && <CheckoutUserPrompt />}

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-8">
              <CheckoutForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                billingAddress={billingAddress}
                setBillingAddress={setBillingAddress}
                useShippingForBilling={useShippingForBilling}
                setUseShippingForBilling={setUseShippingForBilling}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                acceptsMarketing={acceptsMarketing}
                setAcceptsMarketing={setAcceptsMarketing}
                isUserLoggedIn={!!user}
              />
            </div>

            <div className="md:col-span-1 space-y-6 sticky top-24">
              <CheckoutOrderSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                cartCount={cartCount}
                shippingCost={shippingCost}
                taxes={taxes}
                orderTotal={orderTotal}
                isLoading={isSubmitting}
              />
              <CheckoutPaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                orderDetails={getCurrentOrderDetails()}
                onPayPalSuccess={handlePayPalSuccess}
                onPayPalError={handlePayPalError}
                onPayPalProcessing={setCheckoutSubmitting}
                onSimulatedPayment={handleSimulatedPayment}
                isSubmitting={isSubmitting}
              />
               <p className="text-xs text-center text-muted-foreground">
                Al continuar, aceptas nuestros <Link to="/privacy" className="underline hover:text-primary">Términos de Servicio y Política de Privacidad</Link>.
              </p>
            </div>
          </div>
        </motion.div>
      );
    };

    export default CheckoutPage;
  