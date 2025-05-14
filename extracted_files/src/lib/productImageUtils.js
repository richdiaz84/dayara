
    import { supabase } from '@/lib/supabaseClient';

    export const handleImageUpload = async (files, productId, toast) => {
      const uploadedImageUrls = [];
      for (const file of files) {
        const fileName = `${productId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('product_images').upload(fileName, file);
        if (error) {
          toast({ variant: "destructive", title: "Error de Carga", description: `No se pudo subir ${file.name}: ${error.message}` });
          continue;
        }
        const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(data.path);
        uploadedImageUrls.push(publicUrl);
      }
      return uploadedImageUrls;
    };

    export const handleImageRemoval = (index, currentImages, setCurrentImages) => {
      setCurrentImages(prev => prev.filter((_, i) => i !== index));
    };
    
    export const deleteStoredImages = async (urlsToDelete, toast) => {
      if (urlsToDelete.length === 0) return;

      const pathsToDelete = urlsToDelete.map(url => {
        try {
          const urlObject = new URL(url);
          const pathSegments = urlObject.pathname.split('/');
          const bucketNameIndex = pathSegments.findIndex(segment => segment === 'product_images');
          if (bucketNameIndex !== -1 && bucketNameIndex + 1 < pathSegments.length) {
            return pathSegments.slice(bucketNameIndex + 1).join('/');
          }
          const directPathMatch = url.match(/product_images\/(.*)/);
          if (directPathMatch && directPathMatch[1]) return directPathMatch[1];
        } catch (e) {
          console.error("Error parsing URL for deletion:", url, e);
        }
        return null; 
      }).filter(Boolean);

      if (pathsToDelete.length > 0) {
        const { error } = await supabase.storage.from('product_images').remove(pathsToDelete);
        if (error) {
             console.error(`Error deleting images:`, error);
             toast({ variant: "warning", title: "Advertencia", description: `Algunas imágenes antiguas no se pudieron eliminar del almacenamiento. Puede que necesiten eliminarse manualmente.` });
        }
      }
    };
  