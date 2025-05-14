
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { HeartCrack, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (wishlistItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-12 text-center animate-fadeIn"
      >
        <HeartCrack className="h-24 w-24 mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Tu Lista de Deseos está Vacía</h1>
        <p className="text-muted-foreground mb-8">Añade tus productos favoritos para verlos aquí.</p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/products">
            <ShoppingBag className="mr-2 h-5 w-5" /> Explorar Productos
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="container py-8 md:py-12 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
          Mi Lista de Deseos
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tus productos favoritos, guardados en un solo lugar.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {wishlistItems.map(product => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WishlistPage;
