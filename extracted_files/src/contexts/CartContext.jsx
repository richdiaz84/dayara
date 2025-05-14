
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        const parsedItems = JSON.parse(storedCartItems);
        if(Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      const itemExists = currentItems.find(item => item.id === product.id);
      if (itemExists) {
        return currentItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...currentItems, { ...product, quantity }];
    });
    toast({
      title: "¡Producto añadido!",
      description: `${product.name} se ha añadido a tu carrito.`,
      variant: "default",
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.filter(item => item.id !== productId)
    });
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tu carrito.",
      variant: "destructive",
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => {
      const currentItems = Array.isArray(prevItems) ? prevItems : [];
      return currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados de tu carrito.",
    });
  };
  
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartTotal = safeCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  const cartCount = safeCartItems.reduce((count, item) => count + (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems: safeCartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
