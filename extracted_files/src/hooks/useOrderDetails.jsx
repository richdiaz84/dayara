
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useCart } from '@/contexts/CartContext';

    export const useOrderDetails = (orderId, newOrderSession) => {
      const [order, setOrder] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [isNewlyConfirmed, setIsNewlyConfirmed] = useState(false);
      const { clearCart, cartItems } = useCart();

      const fetchOrderDetails = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
          const { data, error: dbError } = await supabase
            .from('orders')
            .select(`*, order_items (id, product_name, product_image, quantity, price_at_purchase, subtotal, product_id)`)
            .eq('id', id)
            .single();

          if (dbError) throw dbError;
          if (!data) throw new Error("Pedido no encontrado.");
          
          setOrder(data);
          
          if (newOrderSession === "true" && (data.payment_status === 'paid' || data.status === 'processing')) {
            if (cartItems && cartItems.length > 0) {
              clearCart();
            }
            setIsNewlyConfirmed(true); 
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
          setError(err.message || "Ocurrió un error al cargar los detalles del pedido.");
        } finally {
          setLoading(false);
        }
      }, [newOrderSession, clearCart, cartItems]);
      
      useEffect(() => {
        if (orderId) {
          fetchOrderDetails(orderId);
        } else {
          setError("No se especificó un ID de pedido.");
          setLoading(false);
        }
      }, [orderId, fetchOrderDetails]);

      return { order, loading, error, isNewlyConfirmed };
    };
  