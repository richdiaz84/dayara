
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Loader2, Package, Video as VideoIcon, Lock, Info, Eye } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';

    const ExclusiveContentPage = () => {
      const { user } = useAuth();
      const [purchasedProductsWithVideos, setPurchasedProductsWithVideos] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchPurchasedContent = async () => {
          if (!user) {
            setLoading(false);
            return;
          }
          setLoading(true);
          setError(null);
          try {
            // 1. Get all product IDs for which the user has video access
            const { data: videoAccessData, error: videoAccessError } = await supabase
              .from('user_product_video_access')
              .select('product_id')
              .eq('user_id', user.id);

            if (videoAccessError) throw videoAccessError;
            
            const accessibleProductIds = videoAccessData.map(va => va.product_id);

            if (accessibleProductIds.length === 0) {
              setPurchasedProductsWithVideos([]);
              setLoading(false);
              return;
            }

            // 2. Fetch details for these products (name, image, etc.)
            //    and also fetch their exclusive videos
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select(`
                id, 
                name, 
                images,
                product_videos (id, title, video_url, description, is_free)
              `)
              .in('id', accessibleProductIds)
              .not('product_videos.is_free', 'eq', true); // Only fetch products that have non-free videos

            if (productsError) throw productsError;
            
            // Filter products to only include those that actually have exclusive videos
            // and format them
            const finalProducts = productsData.filter(p => p.product_videos && p.product_videos.some(v => !v.is_free)).map(p => ({
              ...p,
              // Filter videos again to be absolutely sure only exclusive ones are listed here
              exclusive_videos: p.product_videos.filter(v => !v.is_free)
            }));

            setPurchasedProductsWithVideos(finalProducts || []);

          } catch (err) {
            console.error("Error fetching exclusive content:", err);
            setError(err.message || "No se pudo cargar el contenido exclusivo.");
          } finally {
            setLoading(false);
          }
        };

        fetchPurchasedContent();
      }, [user]);

      if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
      }

      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <Info className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Error al Cargar Contenido</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
          </div>
        );
      }
      
      const getEmbedUrl = (url) => {
        if (!url) return null;
        try {
          const videoUrl = new URL(url);
          if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
            const videoId = videoUrl.hostname.includes('youtu.be') ? videoUrl.pathname.substring(1) : videoUrl.searchParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
          } else if (videoUrl.hostname.includes('vimeo.com')) {
            const videoId = videoUrl.pathname.split('/').pop();
            return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
          }
        } catch (e) { console.error("Invalid video URL:", url, e); }
        return null;
      };


      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-8 md:py-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary flex items-center justify-center">
            <Lock className="mr-3 h-8 w-8" /> Contenido Exclusivo
          </h1>

          {purchasedProductsWithVideos.length === 0 && (
            <Card className="shadow-lg text-center">
              <CardHeader>
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="text-2xl">Aún no tienes contenido exclusivo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Compra productos con videos exclusivos para acceder a tutoriales, demostraciones y más.
                </CardDescription>
                <Button asChild>
                  <Link to="/products">Explorar Productos</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {purchasedProductsWithVideos.length > 0 && (
            <div className="space-y-8">
              {purchasedProductsWithVideos.map(product => (
                <Card key={product.id} className="shadow-xl overflow-hidden bg-card">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 border-b">
                    <img  
                      class="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-lg border" 
                      alt={product.name || "Imagen del producto"}
                     src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                    <div className="flex-1">
                      <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        Acceso a {product.exclusive_videos.length} video(s) exclusivo(s).
                      </CardDescription>
                    </div>
                     <Button asChild variant="outline" size="sm" className="mt-2 sm:mt-0">
                        <Link to={`/products/${product.id}`}><Eye className="mr-2 h-4 w-4"/>Ver Producto</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {product.exclusive_videos.map(video => {
                      const embedUrl = getEmbedUrl(video.video_url);
                      return (
                        <div key={video.id} className="rounded-lg overflow-hidden shadow-md border bg-background">
                           <div className="p-3">
                            <h4 className="font-semibold text-md text-foreground truncate" title={video.title}>{video.title || 'Video Exclusivo'}</h4>
                            {video.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{video.description}</p>}
                          </div>
                          {embedUrl ? (
                            <div className="aspect-video bg-black">
                              <iframe
                                src={embedUrl}
                                title={video.title || 'Video Exclusivo'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          ) : (
                             <div className="aspect-video bg-muted flex items-center justify-center p-3 text-center">
                                <p className="text-destructive text-xs">
                                    <Info className="inline-block mr-1 h-3.5 w-3.5" /> No se pudo generar el reproductor. <br/> 
                                    <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-destructive/80">Ver en sitio original.</a>
                                </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default ExclusiveContentPage;
  