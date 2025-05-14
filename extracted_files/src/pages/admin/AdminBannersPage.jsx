
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Loader2, ImageOff } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import BannerForm from '@/components/admin/banners/BannerForm';
    import BannerCard from '@/components/admin/banners/BannerCard';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

    const AdminBannersPage = () => {
      const { toast } = useToast();
      const [banners, setBanners] = useState([]);
      const [isLoading, setIsLoading] = useState(true); 
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [editingBanner, setEditingBanner] = useState(null);
      const [products, setProducts] = useState([]);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [bannerToDelete, setBannerToDelete] = useState(null);
      const [formSubmitting, setFormSubmitting] = useState(false);

      const fetchBanners = useCallback(async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase.from('banner_ads').select('*').order('created_at', { ascending: false });
          if (error) {
            console.error("Error fetching banners:", error);
            throw error;
          }
          setBanners(data || []);
        } catch (err) {
          toast({ variant: "destructive", title: "Error al cargar banners", description: err.message });
          setBanners([]); 
        } finally {
          setIsLoading(false);
        }
      }, [toast]);

      const fetchProducts = useCallback(async () => {
        try {
          const { data, error } = await supabase.from('products').select('id, name').order('name');
          if (error) throw error;
          setProducts(data || []);
        } catch (err) {
          toast({ variant: "destructive", title: "Error al cargar productos", description: err.message });
          setProducts([]);
        }
      }, [toast]);

      useEffect(() => {
        fetchBanners();
        fetchProducts();
      }, [fetchBanners, fetchProducts]);

      const handleFormSubmit = async (bannerData, bannerId) => {
        setFormSubmitting(true);
        try {
          if (bannerId) {
            const { error } = await supabase.from('banner_ads').update(bannerData).eq('id', bannerId);
            if (error) throw error;
            toast({ title: "Banner Actualizado", description: "El banner ha sido actualizado correctamente." });
          } else {
            const { error } = await supabase.from('banner_ads').insert(bannerData);
            if (error) throw error;
            toast({ title: "Banner Creado", description: "El nuevo banner ha sido creado correctamente." });
          }
          fetchBanners();
          setIsFormOpen(false);
          setEditingBanner(null);
        } catch (err) {
          toast({ variant: "destructive", title: "Error al guardar banner", description: err.message });
        } finally {
          setFormSubmitting(false);
        }
      };

      const handleEdit = (banner) => {
        setEditingBanner(banner);
        setIsFormOpen(true);
      };

      const openDeleteDialog = (banner) => {
        setBannerToDelete(banner);
        setIsDeleteDialogOpen(true);
      };

      const deleteBannerMedia = async (banner) => {
        const imagePaths = (banner.image_urls || []).map(url => {
          try {
            const parsedUrl = new URL(url);
            const pathParts = parsedUrl.pathname.split('/');
            const bucketNameIndex = pathParts.findIndex(part => part === 'banner_images');
            if (bucketNameIndex !== -1 && bucketNameIndex + 1 < pathParts.length) {
              return pathParts.slice(bucketNameIndex + 1).join('/');
            } return null;
          } catch (e) { return null; }
        }).filter(path => path);

        let videoPath = null;
        if (banner.video_url) {
          try {
            const parsedUrl = new URL(banner.video_url);
            const pathParts = parsedUrl.pathname.split('/');
            const bucketNameIndex = pathParts.findIndex(part => part === 'banner_videos');
            if (bucketNameIndex !== -1 && bucketNameIndex + 1 < pathParts.length) {
              videoPath = pathParts.slice(bucketNameIndex + 1).join('/');
            }
          } catch (e) { /* ignore */ }
        }
        
        if (imagePaths.length > 0) {
          const { error } = await supabase.storage.from('banner_images').remove(imagePaths);
          if (error) console.error('Error deleting banner images:', error.message);
        }
        if (videoPath) {
          const { error } = await supabase.storage.from('banner_videos').remove([videoPath]);
          if (error) console.error('Error deleting banner video:', error.message);
        }
      };


      const handleDelete = async () => {
        if (!bannerToDelete) return;
        setFormSubmitting(true); 
        try {
          await deleteBannerMedia(bannerToDelete); 
          const { error } = await supabase.from('banner_ads').delete().eq('id', bannerToDelete.id);
          if (error) throw error;
          toast({ title: "Banner eliminado", description: `El banner "${bannerToDelete.title}" ha sido eliminado.` });
          fetchBanners();
        } catch (err) {
          toast({ variant: "destructive", title: "Error al eliminar banner", description: err.message });
        } finally {
          setFormSubmitting(false); 
          setIsDeleteDialogOpen(false);
          setBannerToDelete(null);
        }
      };
      
      const handleTogglePublish = async (banner) => {
        setFormSubmitting(true);
        try {
          const newActiveState = !banner.active;
          const { data, error } = await supabase
            .from('banner_ads')
            .update({ active: newActiveState, updated_at: new Date().toISOString() })
            .eq('id', banner.id)
            .select()
            .single();

          if (error) throw error;
          
          toast({
            title: `Banner ${newActiveState ? 'publicado' : 'despublicado'}`,
            description: `El banner "${data.title}" ahora está ${newActiveState ? 'activo' : 'inactivo'}.`,
          });
          fetchBanners(); 
        } catch (err) {
          toast({
            variant: 'destructive',
            title: 'Error al actualizar estado',
            description: err.message,
          });
        } finally {
            setFormSubmitting(false);
        }
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07 }
        }
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Banners Publicitarios</h1>
            <Button onClick={() => { setEditingBanner(null); setIsFormOpen(true); }} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Banner
            </Button>
          </div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <BannerForm
                  bannerToEdit={editingBanner}
                  onFormSubmit={handleFormSubmit}
                  onCancel={() => { setIsFormOpen(false); setEditingBanner(null); }}
                  products={products}
                  isLoading={formSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? ( 
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Cargando banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 px-4 bg-card border border-border rounded-md shadow"
            >
              <ImageOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No hay banners creados</h3>
              <p className="text-sm text-muted-foreground mb-4">Comienza creando tu primer banner publicitario para promocionar productos o eventos.</p>
              <Button onClick={() => { setEditingBanner(null); setIsFormOpen(true); }} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear Banner
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {banners.map(banner => (
                <BannerCard 
                  key={banner.id} 
                  banner={banner} 
                  onEdit={handleEdit} 
                  onDelete={openDeleteDialog}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </motion.div>
          )}

          {isDeleteDialogOpen && bannerToDelete && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el banner <span className="font-semibold">"{bannerToDelete.title}"</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={formSubmitting}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={formSubmitting}>
                    {formSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sí, Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </motion.div>
      );
    };

    export default AdminBannersPage;
  