
    import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Search, Barcode, ShoppingCart, Loader2 } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { motion, AnimatePresence } from 'framer-motion';

    const POSProductSearch = ({ onAddToCart, onBarcodeScanned }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [barcode, setBarcode] = useState('');
      const [searchResults, setSearchResults] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const barcodeInputRef = useRef(null);
      const { toast } = useToast();

       const formatCurrency = (amount) => {
        return `Q${amount.toFixed(2)}`;
      };

      const fetchProducts = useCallback(async (term) => {
        if (!term || term.length < 2) {
          setSearchResults([]);
          return;
        }
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, stock, images, barcode, category')
          .or(`name.ilike.%${term}%,category.ilike.%${term}%`)
          .eq('is_published', true)
          .limit(10);

        if (error) {
          toast({ variant: "destructive", title: "Error de Búsqueda", description: "No se pudieron cargar los productos." });
          setSearchResults([]);
        } else {
          setSearchResults(data);
        }
        setIsLoading(false);
      }, [toast]);

      const fetchProductByBarcode = useCallback(async (scannedBarcode) => {
        if (!scannedBarcode) return;
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, stock, images, barcode, category')
          .eq('barcode', scannedBarcode)
          .eq('is_published', true)
          .maybeSingle();

        if (error) {
          toast({ variant: "destructive", title: "Error de Código de Barras", description: "Error al buscar producto." });
        } else if (data) {
          onAddToCart(data);
          toast({ title: "Producto Añadido", description: `${data.name} añadido al carrito.`});
          setBarcode(''); 
          if (barcodeInputRef.current) barcodeInputRef.current.value = '';
        } else {
          toast({ variant: "warning", title: "No Encontrado", description: "Producto no encontrado con ese código de barras." });
        }
        setIsLoading(false);
        onBarcodeScanned(); 
      }, [toast, onAddToCart, onBarcodeScanned]);


      useEffect(() => {
        const handler = setTimeout(() => {
          if (searchTerm) {
            fetchProducts(searchTerm);
          } else {
            setSearchResults([]);
          }
        }, 300);
        return () => clearTimeout(handler);
      }, [searchTerm, fetchProducts]);

      const handleBarcodeSubmit = (e) => {
        e.preventDefault();
        if (barcode) {
          fetchProductByBarcode(barcode);
        }
      };
      
      useEffect(() => {
        if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        }
      }, []);


      return (
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Buscar Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border focus:border-primary"
              />
            </div>

            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Escanear o ingresar código de barras..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
              <Button type="submit" variant="secondary" disabled={isLoading || !barcode}>
                {isLoading && barcode ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
              </Button>
            </form>

            {isLoading && searchTerm && (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              </div>
            )}

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 max-h-96 overflow-y-auto pr-2"
                >
                  {searchResults.map(product => (
                    <Card 
                      key={product.id} 
                      className="p-3 flex items-center justify-between hover:shadow-md transition-shadow bg-background cursor-pointer"
                      onClick={() => onAddToCart(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img  
                          className="h-12 w-12 rounded object-cover" 
                          alt={product.name}
                         src={product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1539278383962-a7774385fa02"} />
                        <div>
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(product.price)} - Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    </Card>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {!isLoading && searchTerm && searchResults.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No se encontraron productos.</p>
            )}
          </CardContent>
        </Card>
      );
    };
    export default POSProductSearch;
  