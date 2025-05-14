
    import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Calendar, Edit, Trash2, Eye, EyeOff, Link as LinkIcon, ChevronLeft, ChevronRight, PlayCircle, Image as ImageIcon } from 'lucide-react';
    import { format } from 'date-fns';
    import { es } from 'date-fns/locale';
    import { motion, AnimatePresence } from 'framer-motion';

    const BannerCard = ({ banner, onEdit, onDelete, onTogglePublish }) => {
      const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

      const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      };

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return format(new Date(dateString), "dd MMM yyyy", { locale: es });
        } catch (e) {
          return 'Fecha inválida';
        }
      };

      const isActive = banner.active && 
                       (!banner.start_date || new Date(banner.start_date) <= new Date()) && 
                       (!banner.end_date || new Date(banner.end_date) >= new Date());

      const mediaItems = [];
      if (banner.image_urls && banner.image_urls.length > 0) {
        banner.image_urls.forEach(url => mediaItems.push({ type: 'image', url }));
      }
      if (banner.video_url) {
        mediaItems.push({ type: 'video', url: banner.video_url });
      }
      
      const hasMultipleMedia = mediaItems.length > 1;

      const nextMedia = () => {
        setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
      };

      const prevMedia = () => {
        setCurrentMediaIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
      };
      
      useEffect(() => {
        let interval;
        if (hasMultipleMedia && banner.transition_effect !== 'manual' && mediaItems.length > 0) {
          interval = setInterval(() => {
            nextMedia();
          }, 7000); 
        }
        return () => clearInterval(interval);
      }, [hasMultipleMedia, mediaItems, banner.transition_effect]);


      const mediaVariants = {
        fade: {
          enter: { opacity: 1, transition: { duration: 0.7 } },
          exit: { opacity: 0, transition: { duration: 0.7 } },
        },
        slide: {
          enter: (direction) => ({ x: 0, opacity: 1, transition: { type: "tween", duration: 0.5 } }),
          exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0, transition: { type: "tween", duration: 0.5 } }),
        },
        kenburns: {
          enter: { scale: 1, opacity: 1, transition: { duration: 10, ease: "linear" } }, 
          exit: { scale: 1.15, opacity: 0, transition: { duration: 0.7 } }, 
        }
      };
      
      const selectedVariant = mediaVariants[banner.transition_effect] || mediaVariants.fade;
      
      const currentMediaItem = mediaItems[currentMediaIndex];

      return (
        <motion.div variants={cardVariants}>
          <Card className="overflow-hidden bg-card/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-foreground">{banner.title}</CardTitle>
                <Badge variant={isActive ? "default" : "outline"} className={`${isActive ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'} text-xs`}>
                  {isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {banner.description && <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">{banner.description}</CardDescription>}
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <div className="aspect-video rounded-md overflow-hidden mb-3 bg-muted relative">
                <AnimatePresence initial={false} custom={currentMediaIndex}>
                  {currentMediaItem && (
                    <motion.div
                      key={`${currentMediaItem.type}-${currentMediaIndex}`}
                      className="w-full h-full absolute inset-0"
                      variants={selectedVariant}
                      initial="exit"
                      animate="enter"
                      exit="exit"
                      custom={currentMediaIndex}
                      style={banner.transition_effect === 'kenburns' && currentMediaItem.type === 'image' ? { transformOrigin: 'center center', animation: 'kenburns-animation 10s ease-in-out infinite alternate' } : {}}
                    >
                      {currentMediaItem.type === 'image' ? (
                        <img
                          src={currentMediaItem.url}
                          alt={`${banner.title} - Media ${currentMediaIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : currentMediaItem.type === 'video' ? (
                        <video
                          src={currentMediaItem.url}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                           <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                         </div>
                      )}
                    </motion.div>
                  )}
                   {!currentMediaItem && (
                     <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                       <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                     </div>
                   )}
                </AnimatePresence>
                {hasMultipleMedia && (
                  <>
                    <Button size="icon_sm" variant="outline" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10" onClick={prevMedia}> <ChevronLeft size={16}/> </Button>
                    <Button size="icon_sm" variant="outline" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10" onClick={nextMedia}> <ChevronRight size={16}/> </Button>
                  </>
                )}
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Inicio: {formatDate(banner.start_date)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Fin: {formatDate(banner.end_date)}</span>
                </div>
                {banner.product_id && (
                  <div className="flex items-center">
                    <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                    <span>Enlazado a producto ID: <span className="font-medium text-foreground">{banner.product_id.substring(0,8)}...</span></span>
                  </div>
                )}
                 {banner.transition_effect && (
                  <div className="flex items-center">
                    <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                    <span>Transición: <span className="font-medium text-foreground">{banner.transition_effect}</span></span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-3 bg-muted/30 border-t flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(banner)} className="flex-1">
                <Edit className="h-4 w-4 mr-1.5" /> Editar
              </Button>
              <Button variant={banner.active ? "secondary" : "default"} size="sm" onClick={() => onTogglePublish(banner)} className="flex-1">
                {banner.active ? <EyeOff className="h-4 w-4 mr-1.5" /> : <Eye className="h-4 w-4 mr-1.5" />}
                {banner.active ? 'Despublicar' : 'Publicar'}
              </Button>
              <Button variant="destructive" size="icon_sm" onClick={() => onDelete(banner)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default BannerCard;
  