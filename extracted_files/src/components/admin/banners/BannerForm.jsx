
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { Loader2, UploadCloud, XCircle, Video, Image as ImageIcon } from 'lucide-react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const BannerForm = ({ bannerToEdit, onFormSubmit, onCancel, products, isLoading }) => {
      const { toast } = useToast();
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [currentImageUrls, setCurrentImageUrls] = useState([]);
      const [newImageFiles, setNewImageFiles] = useState([]);
      const [currentVideoUrl, setCurrentVideoUrl] = useState('');
      const [newVideoFile, setNewVideoFile] = useState(null);
      const [linkUrl, setLinkUrl] = useState('');
      const [active, setActive] = useState(true);
      const [startDate, setStartDate] = useState('');
      const [endDate, setEndDate] = useState('');
      const [productId, setProductId] = useState('');
      const [transitionEffect, setTransitionEffect] = useState('fade');

      const transitionEffects = [
        { value: 'fade', label: 'Desvanecer (Fade)' },
        { value: 'slide', label: 'Deslizar (Slide)' },
        { value: 'kenburns', label: 'Ken Burns (Zoom y Paneo)' },
      ];

      useEffect(() => {
        if (bannerToEdit) {
          setTitle(bannerToEdit.title || '');
          setDescription(bannerToEdit.description || '');
          setCurrentImageUrls(bannerToEdit.image_urls || []);
          setCurrentVideoUrl(bannerToEdit.video_url || '');
          setLinkUrl(bannerToEdit.link_url || '');
          setActive(bannerToEdit.active === undefined ? true : bannerToEdit.active);
          setStartDate(bannerToEdit.start_date ? bannerToEdit.start_date.split('T')[0] : '');
          setEndDate(bannerToEdit.end_date ? bannerToEdit.end_date.split('T')[0] : '');
          setProductId(bannerToEdit.product_id || '');
          setTransitionEffect(bannerToEdit.transition_effect || 'fade');
          setNewImageFiles([]);
          setNewVideoFile(null);
        } else {
          setTitle(''); setDescription(''); setCurrentImageUrls([]); setNewImageFiles([]);
          setCurrentVideoUrl(''); setNewVideoFile(null);
          setLinkUrl(''); setActive(true); setStartDate(''); setEndDate(''); setProductId('');
          setTransitionEffect('fade');
        }
      }, [bannerToEdit]);

      const handleImageFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          setNewImageFiles(prev => [...prev, ...files]);
        }
      };
      
      const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setNewVideoFile(file);
          setCurrentVideoUrl(''); 
        }
      };

      const removeNewImage = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
      };

      const removeCurrentImage = (index) => {
        setCurrentImageUrls(prev => prev.filter((_, i) => i !== index));
      };

      const removeVideo = () => {
        setNewVideoFile(null);
        setCurrentVideoUrl('');
      };


      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || (newImageFiles.length === 0 && currentImageUrls.length === 0 && !newVideoFile && !currentVideoUrl)) {
          toast({ variant: "destructive", title: "Error", description: "Título y al menos una imagen o video son obligatorios." });
          return;
        }

        let uploadedImageUrls = [];
        if (newImageFiles.length > 0) {
          for (const file of newImageFiles) {
            const fileName = `banner_img_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('banner_images')
              .upload(fileName, file, { upsert: true });

            if (uploadError) {
              toast({ variant: "destructive", title: "Error de subida de imagen", description: `Error al subir ${file.name}: ${uploadError.message}` });
              return; 
            }
            const { data: { publicUrl } } = supabase.storage.from('banner_images').getPublicUrl(uploadData.path);
            uploadedImageUrls.push(publicUrl);
          }
        }
        
        let finalVideoUrl = currentVideoUrl;
        if (newVideoFile) {
          const videoFileName = `banner_vid_${Date.now()}_${newVideoFile.name.replace(/\s+/g, '_')}`;
          const { data: videoUploadData, error: videoUploadError } = await supabase.storage
            .from('banner_videos') 
            .upload(videoFileName, newVideoFile, { upsert: true });
          if (videoUploadError) {
            toast({ variant: "destructive", title: "Error de subida de video", description: `Error al subir video: ${videoUploadError.message}` });
            return;
          }
          const { data: { publicUrl: videoPublicUrl } } = supabase.storage.from('banner_videos').getPublicUrl(videoUploadData.path);
          finalVideoUrl = videoPublicUrl;
        }
        
        const finalImageUrls = [...currentImageUrls, ...uploadedImageUrls];
        
        const bannerData = {
          title,
          description,
          image_urls: finalImageUrls.length > 0 ? finalImageUrls : null,
          video_url: finalVideoUrl || null,
          link_url: linkUrl || null,
          active,
          start_date: startDate || null,
          end_date: endDate || null,
          product_id: productId || null,
          transition_effect: transitionEffect,
        };
        onFormSubmit(bannerData, bannerToEdit ? bannerToEdit.id : null);
      };

      return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-foreground">
              {bannerToEdit ? 'Editar Banner' : 'Añadir Nuevo Banner'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} id="banner-form" className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-muted-foreground">Título</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 bg-input text-foreground border-border focus:border-primary" />
              </div>
              <div>
                <Label htmlFor="description" className="text-muted-foreground">Descripción (opcional)</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 bg-input text-foreground border-border focus:border-primary" />
              </div>
              
              <div>
                <Label htmlFor="imageFiles" className="text-muted-foreground">Imágenes del Banner (opcional si se usa video)</Label>
                <Input id="imageFiles" type="file" onChange={handleImageFileChange} accept="image/*" multiple className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {currentImageUrls.map((url, index) => (
                    <div key={`current-img-${index}`} className="relative group">
                      <img  src={url} alt={`Vista previa ${index + 1}`} className="rounded-md h-24 w-full object-cover border" />
                      <Button type="button" variant="destructive" size="icon_sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeCurrentImage(index)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {newImageFiles.map((file, index) => (
                    <div key={`new-img-${index}`} className="relative group">
                      <img  src={URL.createObjectURL(file)} alt={`Nueva ${index + 1}`} className="rounded-md h-24 w-full object-cover border" />
                       <Button type="button" variant="destructive" size="icon_sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeNewImage(index)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="videoFile" className="text-muted-foreground">Video del Banner (opcional si se usan imágenes)</Label>
                <Input id="videoFile" type="file" onChange={handleVideoFileChange} accept="video/*" className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                {(currentVideoUrl || newVideoFile) && (
                  <div className="mt-2 relative group w-full aspect-video">
                    <video src={newVideoFile ? URL.createObjectURL(newVideoFile) : currentVideoUrl} controls className="rounded-md w-full h-full object-cover border" />
                    <Button type="button" variant="destructive" size="icon_sm" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeVideo}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="linkUrl" className="text-muted-foreground">URL de Enlace (opcional)</Label>
                <Input id="linkUrl" type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://ejemplo.com/producto" className="mt-1 bg-input text-foreground border-border focus:border-primary" />
              </div>
              <div>
                <Label htmlFor="productId" className="text-muted-foreground">Enlazar a Producto (opcional)</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger className="w-full mt-1 bg-input border-border focus:border-primary">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguno</SelectItem>
                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transitionEffect" className="text-muted-foreground">Efecto de Transición (para múltiples imágenes/videos)</Label>
                <Select value={transitionEffect} onValueChange={setTransitionEffect}>
                  <SelectTrigger className="w-full mt-1 bg-input border-border focus:border-primary">
                    <SelectValue placeholder="Seleccionar efecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {transitionEffects.map(effect => <SelectItem key={effect.value} value={effect.value}>{effect.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate" className="text-muted-foreground">Fecha de Inicio (opcional)</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 bg-input text-foreground border-border focus:border-primary" />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-muted-foreground">Fecha de Fin (opcional)</Label>
                  <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 bg-input text-foreground border-border focus:border-primary" />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="active" checked={active} onCheckedChange={setActive} />
                <Label htmlFor="active" className="text-muted-foreground">Activo</Label>
              </div>
            </form>
          </CardContent>
           <CardFooter className="flex justify-end space-x-4 p-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" form="banner-form" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bannerToEdit ? 'Actualizar Banner' : 'Guardar Banner'}
            </Button>
          </CardFooter>
        </Card>
      );
    };
    export default BannerForm;
  