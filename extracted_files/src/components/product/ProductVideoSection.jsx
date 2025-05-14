
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Lock, Info, Video as VideoIcon } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';

    const getEmbedUrl = (url) => {
      if (!url) return null;
      try {
        const videoUrl = new URL(url);
        if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
          const videoId = videoUrl.hostname.includes('youtu.be') ? videoUrl.pathname.substring(1) : videoUrl.searchParams.get('v');
          if (!videoId) return null;
          return `https://www.youtube.com/embed/${videoId}`;
        } else if (videoUrl.hostname.includes('vimeo.com')) {
          const videoId = videoUrl.pathname.split('/').pop();
          if (!videoId) return null;
          return `https://player.vimeo.com/video/${videoId}`;
        }
      } catch (e) {
        console.error("Invalid video URL:", url, e);
        return null;
      }
      return null; // Fallback for unsupported URLs
    };

    const ProductVideoSection = ({ productId, productVideos, userVideoAccess }) => {
      const { user } = useAuth();

      if (!productVideos || productVideos.length === 0) {
        return null;
      }

      return (
        <section className="mt-12 py-8 border-t">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <VideoIcon className="mr-3 text-primary h-7 w-7" />
            Videos del Producto
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {productVideos.map(video => {
              const canView = video.is_free || (user && userVideoAccess.has(productId));
              const embedUrl = getEmbedUrl(video.video_url);
              
              return (
                <motion.div 
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg overflow-hidden shadow-xl bg-card border border-border/50 flex flex-col"
                >
                  <div className="p-4 pb-2">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{video.title || 'Video del Producto'}</h3>
                    {video.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>}
                  </div>
                  
                  {canView && embedUrl ? (
                    <div className="aspect-video bg-black">
                       <iframe
                          src={embedUrl}
                          title={video.title || 'Video del Producto'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                    </div>
                  ) : !embedUrl && canView ? (
                    <div className="aspect-video bg-muted flex items-center justify-center p-4 text-center">
                        <p className="text-destructive text-sm">
                            <Info className="inline-block mr-1.5 h-4 w-4" /> No se pudo generar el reproductor para este video. <br/> 
                            <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-destructive/80">Ver en el sitio original.</a>
                        </p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-muted/30 to-muted/60 flex flex-col items-center justify-center text-center p-6">
                      <Lock className="h-10 w-10 text-primary mb-3" />
                      <h4 className="font-semibold text-foreground">Contenido Exclusivo</h4>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        {user ? 'Compra este producto para acceder a este video.' : 'Inicia sesión y compra este producto para acceder.'}
                      </p>
                      {!user && <Button size="sm" asChild><Link to={`/auth?redirect=/products/${productId}`}>Iniciar Sesión</Link></Button>}
                      {user && !canView && <Button size="sm" variant="outline">Comprar para ver</Button> }
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      );
    };

    export default ProductVideoSection;
  