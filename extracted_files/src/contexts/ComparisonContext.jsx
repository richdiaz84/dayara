
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { useToast } from '@/components/ui/use-toast';

    const MAX_COMPARE_ITEMS = 4;

    const ComparisonContext = createContext({
      comparisonItems: [],
      addToComparison: () => {},
      removeFromComparison: () => {},
      clearComparison: () => {},
      isProductInComparison: () => false,
    });

    export const useComparison = () => useContext(ComparisonContext);

    export const ComparisonProvider = ({ children }) => {
      const [comparisonItems, setComparisonItems] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        try {
          const storedComparisonItems = localStorage.getItem('comparisonItems');
          if (storedComparisonItems) {
            const parsedItems = JSON.parse(storedComparisonItems);
            if(Array.isArray(parsedItems)){
              setComparisonItems(parsedItems);
            } else {
              setComparisonItems([]);
            }
          } else {
            setComparisonItems([]);
          }
        } catch (error) {
          setComparisonItems([]);
        }
      }, []);

      useEffect(() => {
        localStorage.setItem('comparisonItems', JSON.stringify(comparisonItems));
      }, [comparisonItems]);

      const addToComparison = (product) => {
        setComparisonItems(prevItems => {
          const currentItems = Array.isArray(prevItems) ? prevItems : [];
          if (currentItems.length >= MAX_COMPARE_ITEMS) {
            toast({
              variant: "destructive",
              title: "Límite Alcanzado",
              description: `Puedes comparar hasta ${MAX_COMPARE_ITEMS} productos a la vez.`,
            });
            return currentItems;
          }
          const itemExists = currentItems.find(item => item.id === product.id);
          if (itemExists) {
            toast({
              title: "Ya en Comparación",
              description: `${product.name} ya está en la lista de comparación.`,
              variant: "default",
            });
            return currentItems;
          }
          toast({
            title: "Añadido a Comparación",
            description: `${product.name} se ha añadido para comparar.`,
          });
          return [...currentItems, product];
        });
      };

      const removeFromComparison = (productId) => {
        const product = comparisonItems.find(item => item.id === productId);
        setComparisonItems(prevItems => {
          const currentItems = Array.isArray(prevItems) ? prevItems : [];
          return currentItems.filter(item => item.id !== productId);
        });
        if (product) {
          toast({
            title: "Eliminado de Comparación",
            description: `${product.name} ha sido eliminado de la lista de comparación.`,
          });
        }
      };

      const clearComparison = () => {
        setComparisonItems([]);
        toast({
          title: "Lista de Comparación Limpiada",
        });
      };

      const isProductInComparison = (productId) => {
        const currentItems = Array.isArray(comparisonItems) ? comparisonItems : [];
        return currentItems.some(item => item.id === productId);
      };
      
      const safeComparisonItems = Array.isArray(comparisonItems) ? comparisonItems : [];

      return (
        <ComparisonContext.Provider value={{ comparisonItems: safeComparisonItems, addToComparison, removeFromComparison, clearComparison, isProductInComparison, MAX_COMPARE_ITEMS }}>
          {children}
        </ComparisonContext.Provider>
      );
    };
  