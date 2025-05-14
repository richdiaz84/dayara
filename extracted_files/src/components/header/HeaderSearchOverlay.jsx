
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const HeaderSearchOverlay = ({ isOpen, toggleSearch }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24"
          onClick={toggleSearch}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-4 text-base sm:text-lg bg-background border-2 border-primary focus:ring-primary focus:border-primary rounded-lg"
                autoFocus
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-primary" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderSearchOverlay;
