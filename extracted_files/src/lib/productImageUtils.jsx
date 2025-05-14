
    import { supabase } from '@/lib/supabaseClient';

    export const uploadProductImages = async (files, productId) => {
      const uploadedImageUrls = [];
      if (!files || files.length === 0) return uploadedImageUrls;
    
      const productFolder = productId || 'temp_uploads';
    
      for (const file of files) {
        const fileName = `${productFolder}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { data, error } = await supabase.storage.from('product_images').upload(fileName, file);
    
        if (error) {
          console.error(`Error uploading ${file.name}:`, error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
    
        const { data: { publicUrl } } = supabase.storage.from('product_images').getPublicUrl(data.path);
        if (!publicUrl) {
          console.error(`Failed to get public URL for ${data.path}`);
          throw new Error(`Failed to get public URL for ${data.path}`);
        }
        uploadedImageUrls.push(publicUrl);
      }
      return uploadedImageUrls;
    };
    
    export const deleteProductImage = async (imageUrl) => {
      if (!imageUrl) return;
    
      try {
        const urlObject = new URL(imageUrl);
        const pathSegments = urlObject.pathname.split('/');
        const bucketNameIndex = pathSegments.findIndex(segment => segment === 'product_images');
    
        if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
          console.warn("Could not determine file path from URL for deletion:", imageUrl);
          return; 
        }
    
        const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');
        
        if (!filePath) {
            console.warn("Empty file path derived for deletion:", imageUrl);
            return;
        }

        const { error } = await supabase.storage.from('product_images').remove([filePath]);
    
        if (error) {
          console.error(`Error deleting image ${filePath}:`, error);
          throw new Error(`Failed to delete image ${filePath}: ${error.message}`);
        }
      } catch (e) {
        console.error("Error parsing URL or deleting image:", imageUrl, e);
        throw new Error(`Error processing image for deletion ${imageUrl}: ${e.message}`);
      }
    };
  