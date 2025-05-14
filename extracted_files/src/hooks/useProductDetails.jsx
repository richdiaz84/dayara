
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';

    export function useProductDetails(productId) {
      const [product, setProduct] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchProduct = useCallback(async () => {
        if (!productId) {
          setLoading(false);
          setError("Product ID is missing.");
          return;
        }
        setLoading(true);
        setError(null);
        try {
          const { data, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

          if (productError) throw productError;
          if (!data) throw new Error("Producto no encontrado");
          setProduct(data);
        } catch (err) {
          console.error("Error fetching product details:", err);
          setError(err.message);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }, [productId]);

      useEffect(() => {
        fetchProduct();
      }, [fetchProduct]);

      return { product, loading, error, refetchProduct: fetchProduct };
    }
  