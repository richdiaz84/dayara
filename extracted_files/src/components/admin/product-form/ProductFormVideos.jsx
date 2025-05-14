
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Badge } from '@/components/ui/badge';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, PlusCircle, Edit, Trash2, Video, GripVertical } from 'lucide-react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

    const ProductFormVideos = ({ productId, initialVideos, isLoadingExternal, onVideosUpdate }) => {
      const [videos, setVideos] = useState(initialVideos || []);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
      const [currentVideo, setCurrentVideo] = useState({ product_id: productId, video_url: '', title: '', description: '', is_free: true, video_order: 0 });
      const { toast } = useToast();

      useEffect(() => {
        setVideos(initialVideos || []);
      }, [initialVideos]);

      const handleVideoChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentVideo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };
      
      const handleVideoSubmit = async (e) => {
        e.preventDefault();
        if (!currentVideo.video_url) {
            toast({ variant: "destructive", title: "URL Requerida", description: "La URL del video es obligatoria." });
            return;
        }
        setIsSubmitting(true);
        try {
            const videoPayload = { ...currentVideo, product_id: productId };
            if (typeof videoPayload.video_order === 'string') videoPayload.video_order = parseInt(videoPayload.video_order, 10) || 0;

            let response;
            if (currentVideo.id) { // Update existing video
                response = await supabase.from('product_videos').update(videoPayload).eq('id', currentVideo.id).select();
            } else { // Create new video
                videoPayload.video_order = videos.length; // Append to end
                response = await supabase.from('product_videos').insert(videoPayload).select();
            }
            const { error } = response;
            if (error) throw error;
            toast({ title: "Éxito", description: `Video ${currentVideo.id ? 'actualizado' : 'añadido'}.` });
            setIsVideoModalOpen(false);
            if (onVideosUpdate) onVideosUpdate(productId);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: `No se pudo guardar el video: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
      };

      const openVideoModal = (video = null) => {
        if (video) {
            setCurrentVideo(video);
        } else {
            setCurrentVideo({ product_id: productId, video_url: '', title: '', description: '', is_free: true, video_order: videos.length });
        }
        setIsVideoModalOpen(true);
      };

      const deleteVideo = async (videoId) => {
        if (!window.confirm("¿Estás seguro de eliminar este video?")) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('product_videos').delete().eq('id', videoId);
            if (error) throw error;
            toast({ title: "Éxito", description: "Video eliminado." });
            if (onVideosUpdate) onVideosUpdate(productId);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: `No se pudo eliminar el video: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
      };

      return (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center"><Video className="mr-2 h-5 w-5 text-primary"/>Videos del Producto</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => openVideoModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Video
            </Button>
          </div>
          {isLoadingExternal && <Loader2 className="animate-spin h-5 w-5 mx-auto" />}
          {!isLoadingExternal && videos.length === 0 && <p className="text-sm text-muted-foreground">No hay videos asociados a este producto.</p>}
          {!isLoadingExternal && videos.length > 0 && (
            <ul className="space-y-2">
              {videos.map(video => (
                <li key={video.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50 hover:bg-muted/70">
                  <div className="flex items-center gap-3">
                     <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                     <div>
                        <p className="font-medium text-sm">{video.title || 'Video sin título'}</p>
                        <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-xs block">{video.video_url}</a>
                        <Badge variant={video.is_free ? "secondary" : "outline"} className="text-xs mt-1">{video.is_free ? 'Gratis' : 'Exclusivo'}</Badge>
                     </div>
                  </div>
                  <div className="space-x-2">
                    <Button type="button" variant="ghost" size="icon" onClick={() => openVideoModal(video)}><Edit className="h-4 w-4" /></Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => deleteVideo(video.id)} disabled={isSubmitting}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

            <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <form onSubmit={handleVideoSubmit}>
                        <DialogHeader>
                            <DialogTitle>{currentVideo.id ? 'Editar' : 'Añadir'} Video</DialogTitle>
                            <DialogDescription>Proporciona los detalles del video para este producto.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="video_form_title">Título del Video</Label>
                                <Input id="video_form_title" name="title" value={currentVideo.title || ''} onChange={handleVideoChange} />
                            </div>
                            <div>
                                <Label htmlFor="video_form_url">URL del Video (YouTube, Vimeo, etc.)</Label>
                                <Input id="video_form_url" name="video_url" value={currentVideo.video_url || ''} onChange={handleVideoChange} required />
                            </div>
                             <div>
                                <Label htmlFor="video_form_description">Descripción (opcional)</Label>
                                <Textarea id="video_form_description" name="description" value={currentVideo.description || ''} onChange={handleVideoChange} />
                            </div>
                             <div>
                                <Label htmlFor="video_form_order">Orden</Label>
                                <Input id="video_form_order" name="video_order" type="number" value={currentVideo.video_order || 0} onChange={handleVideoChange} />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="video_form_is_free" name="is_free" checked={currentVideo.is_free} onCheckedChange={(checked) => setCurrentVideo(prev => ({...prev, is_free: Boolean(checked)}))} />
                                <Label htmlFor="video_form_is_free">Este video es de acceso gratuito</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Video
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
      );
    };
    export default ProductFormVideos;
  