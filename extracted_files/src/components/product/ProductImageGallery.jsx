
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

const ProductImageGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-xl border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <img 
              class="w-full h-full object-cover" 
              alt={images[currentImageIndex].alt || `${productName} - imagen ${currentImageIndex + 1}`}
             src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground" onClick={prevImage}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground" onClick={nextImage}>
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 text-foreground">
              <Maximize className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-3xl p-0">
            <img 
              class="w-full h-auto object-contain rounded-lg" 
              alt={images[currentImageIndex].alt || `${productName} - imagen ${currentImageIndex + 1} ampliada`}
             src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id || `thumb-${index}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-primary/50'}`}
            >
              <img 
                class="w-full h-full object-cover" 
                alt={`Miniatura ${image.alt || `${productName} - imagen ${index + 1}`}`}
               src="https://images.unsplash.com/photo-1613492712451-e52ab36425c5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
