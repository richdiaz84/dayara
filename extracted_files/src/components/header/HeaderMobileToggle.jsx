
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Menu, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const HeaderMobileToggle = ({ isOpen, toggleMenu }) => {
      return (
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="lg:hidden text-foreground/70 hover:text-primary">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "x" : "menu"}
              initial={{ rotate: isOpen ? -90 : 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: isOpen ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      );
    };

    export default HeaderMobileToggle;
  