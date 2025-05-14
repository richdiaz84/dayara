
    import React, { useState, useEffect, useCallback } from 'react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { uploadProductImages, deleteProductImage } from '@/lib/productImageUtils';

    export const useProductFormLogic = ({ product, isOpen, onSave, onClose }) => {
      const initialFormData = {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        is_published: true,
        barcode: '',
        cost_price: '',
        seo_title: '',
        seo_description: '',
        ean_gtin: '',
        weight_kg: '',
        dimensions_cm: '',
      };

      const [formData, setFormData] = useState(initialFormData);
      const [currentImages, setCurrentImages] = useState([]);
      const [newImageFiles, setNewImageFiles] = useState([]);
      const [imagesToRemove, setImagesToRemove] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [categories, setCategories] = useState([]);
      const { toast } = useToast();

      const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase.from('categories').select('name').order('name', { ascending: true });
        if (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
        } else {
          setCategories(data.map(cat => cat.name));
        }
      }, [toast]);

      useEffect(() => {
        if (isOpen) {
          fetchCategories();
          if (product) {
            setFormData({
              name: product.name || '',
              description: product.description || '',
              price: product.price || '',
              stock: product.stock || '',
              category: product.category || '',
              is_published: product.is_published !== undefined ? product.is_published : true,
              barcode: product.barcode || '',
              cost_price: product.cost_price || '',
              seo_title: product.seo_title || '',
              seo_description: product.seo_description || '',
              ean_gtin: product.ean_gtin || '',
              weight_kg: product.weight_kg || '',
              dimensions_cm: product.dimensions_cm || '',
            });
            setCurrentImages(product.images || []);
          } else {
            setFormData(initialFormData);
            setCurrentImages([]);
          }
          setNewImageFiles([]);
          setImagesToRemove([]);
        }
      }, [product, isOpen, fetchCategories]);

      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handleCategoryChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
      };

      const handleNewImageFilesChange = (files) => {
        setNewImageFiles(prev => [...prev, ...files]);
      };

      const handleCurrentImageRemove = (index) => {
        const imageToRemove = currentImages[index];
        setImagesToRemove(prev => [...prev, imageToRemove]);
        setCurrentImages(prev => prev.filter((_, i) => i !== index));
      };

      const handleNewImageFileRemove = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
          let finalImageUrls = [...currentImages];

          if (imagesToRemove.length > 0) {
            for (const imageUrl of imagesToRemove) {
              try {
                await deleteProductImage(imageUrl);
              } catch (deleteError) {
                console.warn(`Failed to delete image ${imageUrl} from storage: ${deleteError.message}`);
                toast({ variant: "warning", title: "Advertencia", description: `No se pudo eliminar la imagen ${imageUrl.split('/').pop()} del almacenamiento. Puede que necesite eliminarse manualmente.` });
              }
            }
          }
          
          finalImageUrls = finalImageUrls.filter(url => !imagesToRemove.some(removedUrl => removedUrl === url));

          if (newImageFiles.length > 0) {
            const uploadedUrls = await uploadProductImages(newImageFiles, product?.id);
            finalImageUrls = [...finalImageUrls, ...uploadedUrls];
          }
          
          const productData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock, 10) || 0,
            cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
            weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
            images: finalImageUrls,
          };

          let result;
          if (product && product.id) {
            result = await supabase.from('products').update(productData).eq('id', product.id).select().single();
          } else {
            result = await supabase.from('products').insert(productData).select().single();
          }

          if (result.error) throw result.error;

          toast({ title: "Éxito", description: `Producto ${product ? 'actualizado' : 'creado'} correctamente.` });
          if (onSave) onSave(result.data);
          if (onClose) onClose();
        } catch (error) {
          console.error('Error saving product:', error);
          toast({ variant: "destructive", title: "Error", description: `No se pudo guardar el producto: ${error.message}` });
        } finally {
          setIsLoading(false);
        }
      };

      return {
        formData,
        currentImages,
        newImageFiles,
        isLoading,
        categories,
        handleChange,
        handleCategoryChange,
        handleNewImageFilesChange,
        handleCurrentImageRemove,
        handleNewImageFileRemove,
        handleSubmit,
        setFormData 
      };
    };
  