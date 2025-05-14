
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { UploadCloud, Trash2 } from 'lucide-react';

    const ProductFormImages = ({ currentImages, newImageFiles, onCurrentImageRemove, onNewImageFileRemove, onNewImageFilesChange }) => {
      const handleImageFileChange = (e) => {
        onNewImageFilesChange(Array.from(e.target.files));
      };

      return (
        <div>
          <Label>Imágenes del Producto</Label>
          <div className="mt-2 space-y-3">
            {currentImages.map((url, index) => (
              <div key={`current-${index}`} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2 truncate">
                  <img src={url} alt={`Imagen actual ${index + 1}`} className="h-10 w-10 object-cover rounded" />
                  <span className="text-xs truncate">{url.split('/').pop()}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => onCurrentImageRemove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            {newImageFiles.map((file, index) => (
              <div key={`new-${index}`} className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2 truncate">
                  <img src={URL.createObjectURL(file)} alt={`Nueva imagen ${index + 1}`} className="h-10 w-10 object-cover rounded" />
                  <span className="text-xs truncate">{file.name}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => onNewImageFileRemove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Label htmlFor="product_images_upload" className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
              <UploadCloud className="h-5 w-5" /> Subir Nuevas Imágenes
            </Label>
            <Input id="product_images_upload" name="images" type="file" multiple onChange={handleImageFileChange} className="sr-only" />
          </div>
        </div>
      );
    };

    export default ProductFormImages;
  