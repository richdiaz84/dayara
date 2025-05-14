
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import ProductFormImages from '@/components/admin/product-form/ProductFormImages';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Loader2 } from 'lucide-react';
    import { useProductFormLogic } from '@/components/admin/product-form/useProductFormLogic';

    const AdminProductForm = ({ isOpen, onClose, product, onSave }) => {
      const {
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
      } = useProductFormLogic({ product, isOpen, onSave, onClose });

      if (!isOpen) return null;

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl bg-card text-card-foreground max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{product ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 bg-input border-border focus:border-primary" />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (GTQ)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="mt-1 bg-input border-border focus:border-primary" />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required className="mt-1 bg-input border-border focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_price">Costo (GTQ)</Label>
                  <Input id="cost_price" name="cost_price" type="number" step="0.01" value={formData.cost_price || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
                </div>
                 <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select onValueChange={handleCategoryChange} value={formData.category} name="category">
                    <SelectTrigger className="w-full mt-1 bg-input border-border focus:border-primary">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover text-popover-foreground">
                      {categories.length > 0 ? categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      )) : <SelectItem value="" disabled>Cargando categorías...</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode">SKU / Código de Barras</Label>
                  <Input id="barcode" name="barcode" value={formData.barcode || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
                </div>
                <div>
                  <Label htmlFor="ean_gtin">EAN / GTIN</Label>
                  <Input id="ean_gtin" name="ean_gtin" value={formData.ean_gtin || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight_kg">Peso (kg)</Label>
                  <Input id="weight_kg" name="weight_kg" type="number" step="0.01" value={formData.weight_kg || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
                </div>
                <div>
                  <Label htmlFor="dimensions_cm">Dimensiones LxAxA (cm)</Label>
                  <Input id="dimensions_cm" name="dimensions_cm" placeholder="ej. 20x10x5" value={formData.dimensions_cm || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
                </div>
              </div>

              <div>
                <Label htmlFor="seo_title">Título SEO</Label>
                <Input id="seo_title" name="seo_title" value={formData.seo_title || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
              </div>
              <div>
                <Label htmlFor="seo_description">Descripción SEO</Label>
                <Textarea id="seo_description" name="seo_description" value={formData.seo_description || ''} onChange={handleChange} className="mt-1 bg-input border-border focus:border-primary" />
              </div>
              
              <ProductFormImages
                currentImages={currentImages}
                newImageFiles={newImageFiles}
                onCurrentImageRemove={handleCurrentImageRemove}
                onNewImageFileRemove={handleNewImageFileRemove}
                onNewImageFilesChange={handleNewImageFilesChange}
              />

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="is_published" name="is_published" checked={formData.is_published} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: Boolean(checked) }))} />
                <Label htmlFor="is_published">Publicar producto</Label>
              </div>
              <DialogFooter className="sm:justify-end pt-6 pb-6 pr-6 sticky bottom-0 bg-card border-t border-border">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {product ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default AdminProductForm;
  