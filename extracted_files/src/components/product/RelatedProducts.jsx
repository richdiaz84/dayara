
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const RelatedProducts = ({ currentProduct, allProducts }) => {
  const related = allProducts
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-16"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">También te podría interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(relatedProduct => (
          <motion.div 
            key={relatedProduct.id} 
            className="animate-slideInUp"
            whileHover={{ y: -5 }}
          >
            <Link to={`/products/${relatedProduct.id}`}>
              <Card className="overflow-hidden group transition-all duration-300 hover:shadow-primary/20">
                <div className="aspect-square w-full overflow-hidden">
                  <img   
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    alt={relatedProduct.images[0].alt}
                   src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                </div>
                <div className="p-3 bg-card">
                  <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{relatedProduct.name}</h3>
                  <p className="text-sm text-primary font-medium">${relatedProduct.price.toFixed(2)}</p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default RelatedProducts;
