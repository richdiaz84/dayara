
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderMobileMenu = ({ isOpen, toggleMenu, navLinks, user, navigate }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-background/95 absolute w-full shadow-lg"
        >
          <nav className="flex flex-col space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => {
                  toggleMenu();
                  window.scrollTo(0, 0);
                }}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {!user && (
              <Button 
                asChild 
                variant="default" 
                className="w-full mt-2 bg-primary hover:bg-primary/90" 
                onClick={() => { toggleMenu(); navigate('/auth');}}
              >
                <NavLink to="/auth">Ingresar / Registrarse</NavLink>
              </Button>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeaderMobileMenu;
