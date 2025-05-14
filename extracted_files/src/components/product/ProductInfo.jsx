
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Badge } from '@/components/ui/badge';
    import { Heart, ShoppingCart, Minus, Plus, Star as StarIcon, Layers } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useComparison } from '@/contexts/ComparisonContext';
    import { useToast } from '@/components/ui/use-toast';

    const ProductInfo = ({ product, selectedQuantity, setSelectedQuantity, onAddToCart, onWishlistToggle, isWishlisted, averageRating, totalReviews }) => {
      const { addToComparison, removeFromComparison, isProductInComparison, MAX_COMPARE_ITEMS, comparisonItems } = useComparison();
      const { toast } = useToast();
      const isInComparison = isProductInComparison(product.id);

      const handleQuantityChange = (amount) => {
        setSelectedQuantity(prev => {
          const newQuantity = prev + amount;
          if (newQuantity < 1) return 1;
          if (newQuantity > product.stock) return product.stock;
          return newQuantity;
        });
      };

      const handleComparisonToggle = () => {
        if (isInComparison) {
          removeFromComparison(product.id);
        } else {
          if (comparisonItems.length < MAX_COMPARE_ITEMS) {
            addToComparison(product);
          } else {
            toast({
              variant: "destructive",
              title: "Límite de Comparación Alcanzado",
              description: `Solo puedes comparar hasta ${MAX_COMPARE_ITEMS} productos.`,
            });
          }
        }
      };

      return (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            {product.category && <Badge variant="outline" className="mb-2 text-primary border-primary">{product.category}</Badge>}
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">{product.name}</h1>
            
            {totalReviews > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({averageRating.toFixed(1)} de {totalReviews} reseñas)</span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary mb-4">${parseFloat(product.price).toFixed(2)}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Label htmlFor="quantity" className="text-sm font-medium">Cantidad:</Label>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} className="h-9 w-9 rounded-r-none">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  id="quantity" 
                  value={selectedQuantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (isNaN(val) || val < 1) setSelectedQuantity(1);
                    else if (val > product.stock) setSelectedQuantity(product.stock);
                    else setSelectedQuantity(val);
                  }}
                  className="w-14 h-9 text-center border-t-0 border-b-0 focus-visible:ring-0"
                  min="1"
                  max={product.stock}
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-9 w-9 rounded-l-none">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">({product.stock} disponibles)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                onClick={onAddToCart} 
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onWishlistToggle} 
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-300 px-4"
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} /> 
                <span className="hidden sm:inline">{isWishlisted ? 'En Deseos' : 'Añadir a Deseos'}</span>
              </Button>
               <Button 
                variant="outline" 
                size="lg" 
                onClick={handleComparisonToggle} 
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-300 px-4"
              >
                <Layers className={`mr-2 h-5 w-5 ${isInComparison ? 'text-blue-500' : ''}`} /> 
                <span className="hidden sm:inline">{isInComparison ? 'En Comparación' : 'Comparar'}</span>
              </Button>
            </div>
          </div>
        </motion.div>
      );
    };

    export default ProductInfo;
  