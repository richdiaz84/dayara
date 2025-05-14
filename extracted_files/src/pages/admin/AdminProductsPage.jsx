
    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import AdminProductForm from '@/components/admin/AdminProductForm';
    import ProductList from '@/components/admin/products/ProductList';
    import ProductActions from '@/components/admin/products/ProductActions';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Loader2, Upload, Download, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";

    const AdminProductsPage = () => {
      const [products, setProducts] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [productToEdit, setProductToEdit] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [productToDelete, setProductToDelete] = useState(null);
      const [categories, setCategories] = useState([]);
      const { toast } = useToast();
      const fileInputRef = useRef(null);
      const [isImporting, setIsImporting] = useState(false);
      const [importResults, setImportResults] = useState(null);
      const [isImportModalOpen, setIsImportModalOpen] = useState(false);

      const fetchCategories = useCallback(async () => {
        try {
          const { data, error } = await supabase.from('categories').select('id, name').order('name');
          if (error) throw error;
          setCategories(data || []);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: `Error al cargar categorías: ${error.message}` });
        }
      }, [toast]);

      const fetchProducts = useCallback(async (currentSearchTerm = searchTerm) => {
        setIsLoading(true);
        try {
          let query = supabase.from('products').select('*').order('created_at', { ascending: false });
          if (currentSearchTerm) {
            query = query.or(`name.ilike.%${currentSearchTerm}%,description.ilike.%${currentSearchTerm}%,category.ilike.%${currentSearchTerm}%,barcode.ilike.%${currentSearchTerm}%,sku.ilike.%${currentSearchTerm}%`);
          }
          const { data, error } = await query;

          if (error) throw error;
          setProducts(data || []);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: `Error al cargar productos: ${error.message}` });
          setProducts([]); 
        } finally {
          setIsLoading(false);
        }
      }, [searchTerm, toast]);
      
      const debouncedFetchProducts = useCallback(
        debounce((term) => fetchProducts(term), 500),
        [fetchProducts] 
      );

      useEffect(() => {
        fetchCategories();
        debouncedFetchProducts(searchTerm);
        return () => {
          debouncedFetchProducts.cancel && debouncedFetchProducts.cancel();
        };
      }, [searchTerm, debouncedFetchProducts, fetchCategories]);


      const handleAddProduct = () => {
        setProductToEdit(null);
        setIsFormOpen(true);
      };

      const handleEditProduct = (product) => {
        setProductToEdit(product);
        setIsFormOpen(true);
      };
      
      const handleFormSave = (savedProduct) => {
        if (productToEdit) {
          setProducts(prevProducts => prevProducts.map(p => p.id === savedProduct.id ? savedProduct : p));
        } else {
          setProducts(prevProducts => [savedProduct, ...prevProducts]);
        }
        setIsFormOpen(false);
        setProductToEdit(null);
        fetchProducts(searchTerm); 
      };


      const deleteProductImages = async (imageUrls) => {
        if (!imageUrls || imageUrls.length === 0) return;
        
        const filePaths = imageUrls.map(url => {
          try {
            const parsedUrl = new URL(url);
            const pathParts = parsedUrl.pathname.split('/');
            const bucketNameIndex = pathParts.findIndex(part => part === 'product_images');
            if (bucketNameIndex !== -1 && bucketNameIndex + 1 < pathParts.length) {
              return pathParts.slice(bucketNameIndex + 1).join('/');
            }
            return null;
          } catch (e) {
            console.error("Invalid URL for deletion:", url, e);
            return null;
          }
        }).filter(path => path);

        if (filePaths.length > 0) {
          const { error } = await supabase.storage.from('product_images').remove(filePaths);
          if (error) {
            console.error('Error deleting images from storage:', error);
            toast({
              variant: "destructive",
              title: "Error de Almacenamiento",
              description: `No se pudieron eliminar algunas imágenes: ${error.message}`,
            });
          }
        }
      };

      const confirmDeleteProduct = (product) => {
        setProductToDelete(product);
      };

      const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        setIsLoading(true);
        try {
          await deleteProductImages(productToDelete.images);
          
          const { error: deleteError } = await supabase.from('products').delete().eq('id', productToDelete.id);
          if (deleteError) throw deleteError;

          toast({ title: "Éxito", description: "Producto y datos asociados eliminados correctamente." });
          setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: `Error al eliminar producto: ${error.message}` });
        } finally {
          setIsLoading(false);
          setProductToDelete(null);
        }
      };

      const handleTogglePublish = async (product) => {
        setIsLoading(true);
        try {
          const updatedProduct = { ...product, is_published: !product.is_published, updated_at: new Date().toISOString() };
          const { error } = await supabase
            .from('products')
            .update({ is_published: updatedProduct.is_published, updated_at: updatedProduct.updated_at })
            .eq('id', product.id);
          if (error) throw error;
          toast({ title: "Éxito", description: `Producto ${updatedProduct.is_published ? 'publicado' : 'ocultado'}.` });
          setProducts(prevProducts => prevProducts.map(p => p.id === product.id ? updatedProduct : p));
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: `No se pudo actualizar el estado: ${error.message}` });
        } finally {
          setIsLoading(false);
        }
      };

      const handleDownloadTemplate = () => {
        const headers = [
          "PRODUCTO", "SKU", "CATEGORIAS", "PRECIO", "TOTAL_COSTOS", 
          "SEO_TITLE", "SEO_DESCRIPTION", "EAN_GTIN", "STOCK", 
          "DESCRIPCION", "IMAGENES", "PUBLICADO", "PESO_KG", "DIMENSIONES_CM_LXAXA"
        ];
        const csvHeaders = headers.join(',');
        const exampleRow = [
          "Ejemplo de Producto", "SKU001", "Uñas Acrílicas", "19.99", "10.50",
          "Título SEO Ejemplo", "Descripción SEO Ejemplo", "1234567890123", "100",
          "Descripción detallada del producto de ejemplo.", 
          "https://url.com/imagen1.jpg,https://url.com/imagen2.jpg", 
          "true", "0.5", "20x10x5"
        ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');

        const csvContent = `${csvHeaders}\n${exampleRow}`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "plantilla_productos_dayara.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
      };

      const handleImportCSV = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);
        setImportResults(null);
        setIsImportModalOpen(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                setImportResults({ successful: 0, failed: 0, errors: [{ error: "El archivo CSV está vacío o solo contiene encabezados." }] });
                setIsImporting(false);
                if(fileInputRef.current) fileInputRef.current.value = "";
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
            const productsArray = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(','); 
                const product = {};
                headers.forEach((header, index) => {
                    product[header] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
                });
                productsArray.push(product);
            }

            if (productsArray.length > 0) {
                try {
                    const { data: results, error: functionError } = await supabase.functions.invoke('import-products-csv', {
                        body: { products: productsArray }
                    });

                    if (functionError) throw functionError;
                    
                    if (results.error) { 
                         throw new Error(results.error);
                    }
                    
                    setImportResults(results);
                    if(results.successful > 0) fetchProducts(searchTerm);

                } catch (err) {
                    console.error("Error invoking import function or processing results:", err);
                    setImportResults({ successful: 0, failed: productsArray.length, errors: [{ error: `Error en la importación: ${err.message}` }] });
                }
            } else {
                setImportResults({ successful: 0, failed: 0, errors: [{ error: "No se encontraron productos para importar en el archivo." }] });
            }
            setIsImporting(false);
            if(fileInputRef.current) fileInputRef.current.value = ""; 
        };
        reader.readAsText(file);
      };
      
      function debounce(func, wait) {
        let timeout;
        const debouncedFunction = function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
        debouncedFunction.cancel = () => {
            clearTimeout(timeout);
        };
        return debouncedFunction;
      }


      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4 md:px-6"
        >
          <ProductActions
            onAddProduct={handleAddProduct}
            onRefreshProducts={() => fetchProducts(searchTerm)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
            onDownloadTemplate={handleDownloadTemplate}
            onImportClick={() => fileInputRef.current && fileInputRef.current.click()}
          />
          <input type="file" ref={fileInputRef} onChange={handleImportCSV} accept=".csv" style={{ display: 'none' }} />

          {isLoading && products.length === 0 && !searchTerm ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : !isLoading && products.length === 0 && !searchTerm ? (
             <p className="text-center text-muted-foreground mt-10">No hay productos. ¡Añade el primero!</p>
          ) : !isLoading && products.length === 0 && searchTerm ? (
            <p className="text-center text-muted-foreground mt-10">No se encontraron productos para "{searchTerm}".</p>
          ) : (
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={confirmDeleteProduct}
              onTogglePublish={handleTogglePublish}
              isLoading={isLoading}
            />
          )}

          <AnimatePresence>
            {isFormOpen && (
               <AdminProductForm
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setProductToEdit(null); }}
                product={productToEdit}
                onSave={handleFormSave}
              />
            )}
          </AnimatePresence>

          <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar Eliminación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Estás a punto de eliminar el producto "{productToDelete?.name}". Esta acción también eliminará videos, reseñas y accesos asociados. No se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-primary" /> Resultados de la Importación
                </DialogTitle>
                <DialogDescription>
                  Resumen de los productos importados desde el archivo CSV.
                </DialogDescription>
              </DialogHeader>
              {isImporting ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Procesando archivo, por favor espera...</p>
                </div>
              ) : importResults ? (
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center p-3 rounded-md bg-green-500/10 border border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{importResults.successful} productos importados exitosamente.</p>
                  </div>
                  {importResults.failed > 0 && (
                    <div className="flex items-center p-3 rounded-md bg-red-500/10 border border-red-500/30">
                      <XCircle className="h-5 w-5 text-red-600 mr-3" />
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">{importResults.failed} productos fallaron al importar.</p>
                    </div>
                  )}
                  {importResults.errors && importResults.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Detalles de Errores:</h4>
                      <ul className="space-y-1 text-xs list-disc list-inside pl-2 text-muted-foreground">
                        {importResults.errors.slice(0,10).map((err, index) => (
                          <li key={index} className="flex items-start">
                             <AlertTriangle className="h-3 w-3 text-destructive mr-1.5 mt-0.5 flex-shrink-0"/>
                             <span><strong>{err.productName || 'Producto desconocido'}</strong>: {err.error}</span>
                          </li>
                        ))}
                        {importResults.errors.length > 10 && <li>...y {importResults.errors.length - 10} más errores.</li>}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-primary/50"/>
                  Esperando archivo para procesar...
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </motion.div>
      );
    };

    export default AdminProductsPage;
  