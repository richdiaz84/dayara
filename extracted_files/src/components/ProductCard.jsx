
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { Heart, ShoppingCart, Eye, Layers } from 'lucide-react';
    import { useCart } from '@/contexts/CartContext';
    import { useWishlist } from '@/contexts/WishlistContext';
    import { useComparison } from '@/contexts/ComparisonContext';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';

    const ProductCard = ({ product }) => {
      const { addToCart } = useCart();
      const { addToWishlist, removeFromWishlist, isProductInWishlist } = useWishlist();
      const { addToComparison, removeFromComparison, isProductInComparison, MAX_COMPARE_ITEMS, comparisonItems } = useComparison();
      const { toast } = useToast();

      if (!product) return null;

      const isWishlisted = isProductInWishlist(product.id);
      const isInComparison = isProductInComparison(product.id);

      const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      };

      const handleComparisonToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
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

      const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
          addToCart(product, 1);
        } else {
          toast({
            variant: "destructive",
            title: "Producto Agotado",
            description: `${product.name} no está disponible actualmente.`,
          });
        }
      };

      const cardVariants = {
        rest: { scale: 1, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
        hover: { scale: 1.03, boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" }
      };
      
      const imageVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.1 }
      };

      return (
        <motion.div variants={cardVariants} initial="rest" whileHover="hover" animate="rest" className="h-full">
          <Card className="h-full flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 bg-card">
            <CardHeader className="p-0 relative">
              <Link to={`/products/${product.id}`} className="block overflow-hidden aspect-square">
                <motion.div variants={imageVariants} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                     src="https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Layers className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              </Link>
              {product.category && (
                <Badge variant="secondary" className="absolute top-3 left-3 bg-primary/80 text-primary-foreground backdrop-blur-sm">
                  {product.category}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-card/50 hover:bg-card/80 backdrop-blur-sm rounded-full text-destructive"
                onClick={handleWishlistToggle}
                aria-label={isWishlisted ? "Quitar de deseos" : "Añadir a deseos"}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive' : ''}`} />
              </Button>
            </CardHeader>
            
            <CardContent className="p-4 flex-grow">
              <Link to={`/products/${product.id}`}>
                <CardTitle className="text-lg font-semibold mb-1 text-foreground hover:text-primary transition-colors line-clamp-2">{product.name}</CardTitle>
              </Link>
              <CardDescription className="text-xs text-muted-foreground line-clamp-2">{product.description}</CardDescription>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-primary">${parseFloat(product.price).toFixed(2)}</p>
                  {product.stock === 0 && <Badge variant="destructive">Agotado</Badge>}
                  {product.stock > 0 && product.stock < 10 && <Badge variant="warning">Poco Stock</Badge>}
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="default" 
                    className="flex-1" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Añadir
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-3 border-primary text-primary hover:bg-primary/10"
                    onClick={handleComparisonToggle}
                    aria-label={isInComparison ? "Quitar de comparación" : "Añadir a comparación"}
                  >
                    <Layers className={`h-4 w-4 ${isInComparison ? 'text-blue-500' : ''}`} />
                  </Button>
                </div>
                 <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-primary">
                    <Link to={`/products/${product.id}`}><Eye className="mr-2 h-4 w-4" /> Ver Detalles</Link>
                 </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default ProductCard;
  