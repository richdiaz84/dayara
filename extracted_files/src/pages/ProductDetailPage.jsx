
    import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { useCart } from '@/contexts/CartContext';
    import { useWishlist } from '@/contexts/WishlistContext';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Heart, ShoppingCart, ArrowLeft, Info, Loader2, MessageSquare } from 'lucide-react';
    import { motion } from 'framer-motion';
    import ProductImageGallery from '@/components/product/ProductImageGallery';
    import ProductInfo from '@/components/product/ProductInfo';
    import ProductTabs from '@/components/product/ProductTabs';
    import RelatedProducts from '@/components/product/RelatedProducts';
    import { useAuth } from '@/contexts/AuthContext';
    import ProductVideoSection from '@/components/product/ProductVideoSection';
    import ProductReviewSection from '@/components/product/ProductReviewSection';
    import ProductReviewForm from '@/components/product/ProductReviewForm';
    import ProductReviewList from '@/components/product/ProductReviewList';
    import { useProductDetails } from '@/hooks/useProductDetails';
    import { useProductVideos } from '@/hooks/useProductVideos';
    import { useProductReviews } from '@/hooks/useProductReviews';

    const ProductDetailPage = () => {
      const { productId } = useParams();
      const { user } = useAuth();
      const { toast } = useToast();
      
      const { product, loading: productLoading, error: productError, refetchProduct } = useProductDetails(productId);
      const { productVideos, userVideoAccess, loading: videosLoading, error: videosError, refetchVideos } = useProductVideos(productId, user?.id);
      const { 
        reviews, 
        averageRating, 
        totalReviews, 
        hasUserPurchased, 
        loading: reviewsLoading, 
        error: reviewsError, 
        refetchReviews 
      } = useProductReviews(productId, user?.id);

      const [selectedQuantity, setSelectedQuantity] = useState(1);
      const { addToCart } = useCart();
      const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();

      const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;
      
      const loading = productLoading || videosLoading || reviewsLoading;
      const error = productError || videosError || reviewsError;

      useEffect(() => {
        // This will re-run if productId changes, effectively fetching all data.
        // Individual refetch functions can be called if needed for more granular updates.
      }, [productId]);


      const handleAddToCart = () => {
        if (product) {
          addToCart(product, selectedQuantity);
        }
      };

      const handleWishlistToggle = () => {
        if (!product) return;
        if (isWishlisted) {
          removeFromWishlist(product.id);
          toast({ title: "Eliminado de Favoritos", description: `${product.name} ha sido eliminado de tu lista de deseos.` });
        } else {
          addToWishlist(product);
          toast({ title: "Añadido a Favoritos", description: `${product.name} ha sido añadido a tu lista de deseos.` });
        }
      };
      
      const onReviewSubmitted = () => {
        refetchReviews(); 
        toast({ title: "Reseña Enviada", description: "Gracias por tu reseña. Será revisada pronto." });
      };

      if (loading) {
        return <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
      }

      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <Info className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-3">Error al Cargar Producto</h1>
            <p className="text-muted-foreground mb-6">{error.message || "Ocurrió un error desconocido."}</p>
            <Button asChild><Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Productos</Link></Button>
          </div>
        );
      }

      if (!product) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <Info className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-3">Producto No Encontrado</h1>
            <p className="text-muted-foreground mb-6">El producto que buscas no existe o no está disponible.</p>
            <Button asChild><Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Productos</Link></Button>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-8 md:py-12"
        >
          <Button variant="outline" asChild className="mb-6">
            <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Productos</Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <ProductImageGallery images={product.images} productName={product.name} />
            <ProductInfo 
              product={product}
              selectedQuantity={selectedQuantity}
              setSelectedQuantity={setSelectedQuantity}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isWishlisted}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
          
          <ProductTabs product={product} reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
          
          <ProductVideoSection 
            productId={product.id}
            productVideos={productVideos}
            userVideoAccess={userVideoAccess}
          />

          <ProductReviewSection>
            <h2 className="text-2xl font-bold mb-6 flex items-center"><MessageSquare className="mr-3 text-primary h-7 w-7" />Reseñas del Producto</h2>
            {reviews.length > 0 && <ProductReviewList reviews={reviews} />}
            {reviews.length === 0 && !reviewsLoading && <p className="text-muted-foreground mb-6">Este producto aún no tiene reseñas. ¡Sé el primero!</p>}
            {reviewsLoading && <Loader2 className="h-6 w-6 animate-spin text-primary my-4" />}
            
            {user && hasUserPurchased && (
              <ProductReviewForm productId={product.id} userId={user.id} onReviewSubmitted={onReviewSubmitted} />
            )}
            {user && !hasUserPurchased && !reviewsLoading && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Debes haber comprado este producto para dejar una reseña.</p>
              </div>
            )}
            {!user && !reviewsLoading && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  <Link to={`/auth?redirect=/products/${productId}`} className="text-primary underline">Inicia sesión</Link> para dejar una reseña.
                </p>
              </div>
            )}
          </ProductReviewSection>
          
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </motion.div>
      );
    };

    export default ProductDetailPage;
  