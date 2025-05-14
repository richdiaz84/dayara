
    import React from 'react';
    import { motion } from 'framer-motion';

    const ProductReviewSection = ({ children }) => {
      return (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 py-8 border-t"
        >
          {children}
        </motion.section>
      );
    };

    export default ProductReviewSection;
  