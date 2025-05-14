
    import { useState, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useCart } from '@/contexts/CartContext';
    import { useAuth } from '@/contexts/AuthContext';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useLoyalty } from '@/contexts/LoyaltyContext';

    export const useCheckout = () => {
      const { user } = useAuth();
      const { cartItems, cartTotal, clearCart } = useCart();
      const { toast } = useToast();
      const navigate = useNavigate();
      const { addLoyaltyPoints } = useLoyalty();

      const [isSubmitting, setIsSubmitting] = useState(false);

      const syncToMarketingContacts = async (orderPayload) => {
        if (!orderPayload.accepts_marketing || !orderPayload.customer_email) return;
        const nameParts = orderPayload.customer_name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        try {
          const { error } = await supabase
            .from('marketing_contacts')
            .upsert({
              email: orderPayload.customer_email,
              first_name: firstName,
              last_name: lastName,
              phone: orderPayload.shipping_address_phone,
              status: 'subscribed',
              tags: ['customer'],
              last_order_date: new Date().toISOString().split('T')[0],
              total_spent: orderPayload.total,
              updated_at: new Date().toISOString()
            }, { onConflict: 'email', ignoreDuplicates: false });

          if (error && error.code !== '23505') { 
            console.error('Error syncing to marketing contacts:', error);
            toast({ variant: "destructive", title: "Error de Marketing", description: "No se pudo actualizar la suscripción de marketing." });
          } else if (!error) {
            console.log('Customer synced to marketing contacts:', orderPayload.customer_email);
          }
        } catch (e) {
          console.error('Exception syncing to marketing contacts:', e);
        }
      };

      const triggerAccountingSync = async (order) => {
        console.log("Placeholder: Triggering accounting sync for order:", order.id);
        try {
          await supabase.functions.invoke('sync-accounting', { body: { order } });
          await supabase.from('accounting_sync_log').insert({ order_id: order.id, status: 'triggered', payload: order });
        } catch (error) {
          console.error("Error logging/triggering accounting sync:", error);
           await supabase.from('accounting_sync_log').insert({ order_id: order.id, status: 'failed_trigger', error_message: error.message, payload: order });
        }
      };

      const triggerShippingSync = async (order) => {
        console.log("Placeholder: Triggering shipping sync for order:", order.id);
        try {
          const shippingPayload = {
            order_id: order.id,
            shipping_address: { street: order.shipping_address_street, city: order.shipping_address_city, state: order.shipping_address_state, zip: order.shipping_address_zip, country: order.shipping_address_country, phone: order.shipping_address_phone, name: order.customer_name },
            items: cartItems.map(item => ({ id: item.product_id || item.id, name: item.product_name || item.name, quantity: item.quantity }))
          };
          await supabase.functions.invoke('sync-shipping', { body: shippingPayload });
          await supabase.from('shipping_sync_log').insert({ order_id: order.id, status: 'triggered', payload: shippingPayload });
        } catch (error) {
          console.error("Error logging/triggering shipping sync:", error);
          await supabase.from('shipping_sync_log').insert({ order_id: order.id, status: 'failed_trigger', error_message: error.message, payload: { order_id: order.id } });
        }
      };

      const createOrderInSupabase = useCallback(async (orderDetails, paymentProvider, transactionId) => {
        const finalOrderDetails = {
          ...orderDetails,
          status: 'processing',
          payment_status: 'paid',
          payment_method: paymentProvider,
          transaction_id: transactionId,
        };

        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert(finalOrderDetails)
          .select()
          .single();
        if (orderError) throw orderError;

        const orderItemsData = cartItems.map(item => ({
          order_id: newOrder.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          product_name: item.name,
          product_image: (item.images && item.images.length > 0) ? item.images[0] : null,
          price_at_purchase: item.price,
          subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
        if (itemsError) {
          await supabase.from('orders').update({ status: 'error_items_failed', notes: `${finalOrderDetails.notes || ''} Error items: ${itemsError.message}`}).eq('id', newOrder.id);
          throw itemsError;
        }
        
        for (const item of cartItems) {
          const { error: stockError } = await supabase.rpc('decrement_product_stock', { p_product_id: item.id, p_quantity: item.quantity });
          if (stockError) console.error(`Error updating stock for ${item.id}:`, stockError);
        }
        
        for (const item of cartItems) {
          const { data: videos } = await supabase.from('product_videos').select('id').eq('product_id', item.id).eq('is_free', false);
          if (videos && videos.length > 0 && user) {
            await supabase.from('user_product_video_access').insert({ user_id: user.id, product_id: item.id, order_id: newOrder.id });
          }
        }
        
        if (user) {
          const pointsEarned = Math.floor(newOrder.total);
          await addLoyaltyPoints(user.id, pointsEarned, newOrder.id);
        }

        if (newOrder.accepts_marketing) {
          const { data: marketingSyncData, error: marketingSyncError } = await supabase.functions.invoke('sync-email-marketing', {
            body: {
              email: newOrder.customer_email,
              firstName: newOrder.customer_name?.split(' ')[0] || '',
              lastName: newOrder.customer_name?.split(' ').slice(1).join(' ') || '',
              tags: ['customer', 'new_order']
            }
          });
          if (marketingSyncError) console.error("Error en sync-email-marketing:", marketingSyncError);
          else console.log("sync-email-marketing response:", marketingSyncData);
          await syncToMarketingContacts(newOrder); 
        }
        
        await triggerAccountingSync(newOrder);
        await triggerShippingSync(newOrder);

        return newOrder;
      }, [user, cartItems, addLoyaltyPoints]);


      const processPayPalOrder = useCallback(async (orderDetails, payPalTransactionId, payPalOrderDetails) => {
        setIsSubmitting(true);
        try {
          const newOrder = await createOrderInSupabase(orderDetails, 'paypal', payPalTransactionId);
          toast({ title: "¡Pedido Realizado con PayPal!", description: "Tu pedido ha sido procesado con éxito." });
          clearCart();
          navigate(`/order-confirmation/${newOrder.id}?new_order_session=true`);
        } catch (error) {
          console.error("Error processing PayPal order:", error);
          toast({ variant: "destructive", title: "Error en el Pedido", description: `No se pudo completar tu pedido con PayPal: ${error.message}` });
        } finally {
          setIsSubmitting(false);
        }
      }, [createOrderInSupabase, toast, clearCart, navigate]);
      
      const processSimulatedPayment = useCallback(async (orderDetails) => {
        setIsSubmitting(true);
         try {
            const paymentResult = await new Promise(resolve => setTimeout(() => resolve({ success: true, transactionId: `sim_${Date.now()}` }), 1500));
            if (!paymentResult.success) {
                toast({ variant: "destructive", title: "Pago Simulado Fallido", description: "Inténtalo de nuevo." });
                setIsSubmitting(false);
                return;
            }
            const newOrder = await createOrderInSupabase(orderDetails, 'simulated_gateway', paymentResult.transactionId);
            toast({ title: "¡Pedido Realizado! (Simulado)", description: "Tu pedido ha sido procesado con éxito." });
            clearCart();
            navigate(`/order-confirmation/${newOrder.id}?new_order_session=true`);
        } catch (error) {
            console.error("Error processing simulated order:", error);
            toast({ variant: "destructive", title: "Error en el Pedido", description: `No se pudo completar tu pedido: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
      }, [createOrderInSupabase, toast, clearCart, navigate]);


      return { isSubmitting, processPayPalOrder, processSimulatedPayment, setIsSubmitting };
    };
  