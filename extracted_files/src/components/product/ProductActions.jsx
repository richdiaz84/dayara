
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/components/ui/use-toast';

const ProductActions = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product, quantity);
  };

  const handleToggleWishlist = () => {
    if (isProductInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `¡Mira este increíble producto: ${product.name}!`,
        url: window.location.href,
      })
      .then(() => toast({ title: "Producto compartido", description: "¡Gracias por compartir!" }))
      .catch((error) => toast({ title: "Error al compartir", description: error.message, variant: "destructive" }));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Enlace copiado", description: "El enlace al producto ha sido copiado al portapapeles." });
    }
  };

  const inWishlist = isProductInWishlist(product.id);

  return (
    <>
      <div className="flex items-center space-x-3">
        <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">Cantidad:</label>
        <Input
          id={`quantity-${product.id}`}
          type="number"
          min="1"
          max={product.stock > 0 ? product.stock : 1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 h-9 text-center bg-background border-primary/30 focus:border-primary"
          disabled={product.stock === 0}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 bg-primary hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleToggleWishlist}
          className={`flex-1 border-primary hover:bg-primary/10 ${inWishlist ? 'bg-primary/20 text-primary' : 'text-primary'}`}
        >
          <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-primary' : ''}`} />
          {inWishlist ? 'En Deseos' : 'Añadir a Deseos'}
        </Button>
        <Button size="lg" variant="outline" onClick={shareProduct} className="border-primary text-primary hover:bg-primary/10">
          <Share2 className="mr-2 h-5 w-5" /> Compartir
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
