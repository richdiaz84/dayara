
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const WishlistContext = createContext({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isProductInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWishlistItems = localStorage.getItem('wishlistItems');
      if (storedWishlistItems) {
        const parsedItems = JSON.parse(storedWishlistItems);
        if(Array.isArray(parsedItems)){
          setWishlistItems(parsedItems);
        } else {
           setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
       setWishlistItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExists = currentItems.find(item => item.id === product.id);
      if (itemExists) {
        toast({
          title: "Ya está en tu lista",
          description: `${product.name} ya se encuentra en tu lista de deseos.`,
          variant: "default",
        });
        return currentItems;
      }
      toast({
        title: "¡Añadido a deseos!",
        description: `${product.name} se ha añadido a tu lista de deseos.`,
      });
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    const product = wishlistItems.find(item => item.id === productId);
    setWishlistItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.filter(item => item.id !== productId)
    });
    if (product) {
      toast({
        title: "Eliminado de deseos",
        description: `${product.name} ha sido eliminado de tu lista de deseos.`,
        variant: "destructive",
      });
    }
  };

  const isProductInWishlist = (productId) => {
    const currentItems = Array.isArray(wishlistItems) ? wishlistItems : [];
    return currentItems.some(item => item.id === productId);
  };
  
  const safeWishlistItems = Array.isArray(wishlistItems) ? wishlistItems : [];

  return (
    <WishlistContext.Provider value={{ wishlistItems: safeWishlistItems, addToWishlist, removeFromWishlist, isProductInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
