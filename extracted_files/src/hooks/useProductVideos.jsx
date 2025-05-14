
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';

    export function useProductVideos(productId, userId) {
      const [productVideos, setProductVideos] = useState([]);
      const [userVideoAccess, setUserVideoAccess] = useState(new Set());
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const fetchVideos = useCallback(async () => {
        if (!productId) {
          setLoading(false);
          setError(null); // No error if no product ID, just no videos
          setProductVideos([]);
          setUserVideoAccess(new Set());
          return;
        }
        
        setLoading(true);
        setError(null);
        try {
          const { data: videosData, error: videosError } = await supabase
            .from('product_videos')
            .select('*')
            .eq('product_id', productId)
            .order('video_order', { ascending: true });
          
          if (videosError) throw videosError;
          setProductVideos(videosData || []);

          if (userId && videosData && videosData.some(v => !v.is_free)) {
            const { data: accessData, error: accessError } = await supabase
              .from('user_product_video_access')
              .select('product_id')
              .eq('user_id', userId)
              .eq('product_id', productId);
            
            if (accessError) throw accessError;
            if (accessData && accessData.length > 0) {
              setUserVideoAccess(new Set(accessData.map(a => a.product_id)));
            } else {
              setUserVideoAccess(new Set());
            }
          } else {
            setUserVideoAccess(new Set());
          }
        } catch (err) {
          console.error("Error fetching product videos:", err);
          setError(err.message);
          setProductVideos([]);
          setUserVideoAccess(new Set());
        } finally {
          setLoading(false);
        }
      }, [productId, userId]);

      useEffect(() => {
        fetchVideos();
      }, [fetchVideos]);

      return { productVideos, userVideoAccess, loading, error, refetchVideos: fetchVideos };
    }
  