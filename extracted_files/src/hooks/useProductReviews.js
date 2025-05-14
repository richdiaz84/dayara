
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    export function useProductReviews(productId, userId) {
      const [reviews, setReviews] = useState([]);
      const [averageRating, setAverageRating] = useState(0);
      const [totalReviews, setTotalReviews] = useState(0);
      const [hasUserPurchased, setHasUserPurchased] = useState(false);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { toast } = useToast();

      const fetchReviewsAndPurchaseStatus = useCallback(async () => {
        if (!productId) {
          setLoading(false);
          setError(null);
          setReviews([]);
          setAverageRating(0);
          setTotalReviews(0);
          setHasUserPurchased(false);
          return;
        }
        
        setLoading(true);
        setError(null);
        try {
          // Fetch reviews
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('product_reviews')
            .select(`*, profiles:user_id (email, raw_user_meta_data)`)
            .eq('product_id', productId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });
          if (reviewsError) throw reviewsError;
          
          const formattedReviews = reviewsData.map(r => ({
            ...r,
            user_name: r.profiles?.raw_user_meta_data?.full_name || r.profiles?.email || 'Anónimo'
          })) || [];
          setReviews(formattedReviews);

          if (formattedReviews.length > 0) {
            const sum = formattedReviews.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(sum / formattedReviews.length);
            setTotalReviews(formattedReviews.length);
          } else {
            setAverageRating(0);
            setTotalReviews(0);
          }

          // Check purchase status
          if (userId) {
            const { data: ordersData, error: ordersError } = await supabase
              .from('orders')
              .select('id, order_items!inner(product_id)')
              .eq('user_id', userId)
              .in('payment_status', ['paid', 'completed']) 
              .eq('order_items.product_id', productId) 
              .limit(1);

            if (ordersError) throw ordersError;
            setHasUserPurchased(ordersData && ordersData.length > 0);
          } else {
            setHasUserPurchased(false);
          }

        } catch (err) {
          console.error("Error fetching reviews/purchase status:", err);
          setError(err.message);
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar datos de reseñas o compra."});
        } finally {
          setLoading(false);
        }
      }, [productId, userId, toast]);

      useEffect(() => {
        fetchReviewsAndPurchaseStatus();
      }, [fetchReviewsAndPurchaseStatus]);

      return { 
        reviews, 
        averageRating, 
        totalReviews, 
        hasUserPurchased, 
        loading, 
        error, 
        refetchReviews: fetchReviewsAndPurchaseStatus 
      };
    }
  