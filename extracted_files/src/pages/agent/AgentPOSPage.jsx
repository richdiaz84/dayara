
    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Loader2, Search, Trash2, Plus, Minus, Barcode, UserPlus, DollarSign, ShoppingBag } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useLoyalty } from '@/contexts/LoyaltyContext';

    const AgentPOSPage = () => {
      const { user: agentUser } = useAuth();
      const { toast } = useToast();
      const { addLoyaltyPoints } = useLoyalty();
      const [searchTerm, setSearchTerm] = useState('');
      const [barcodeScan, setBarcodeScan] = useState('');
      const [searchResults, setSearchResults] = useState([]);
      const [cart, setCart] = useState([]);
      const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', acceptsMarketing: false });
      const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
      const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
      const [loadingSearch, setLoadingSearch] = useState(false);
      const barcodeInputRef = useRef(null);

      const fetchProductByBarcode = async (scannedBarcode) => {
        if (!scannedBarcode) return null;
        setLoadingSearch(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('barcode', scannedBarcode)
            .eq('is_published', true)
            .single();
          if (error && error.code !== 'PGRST116') throw error; 
          return data;
        } catch (error) {
          console.error('Error fetching product by barcode:', error);
          toast({ variant: "destructive", title: "Error de Código", description: "No se pudo buscar el producto por código de barras." });
          return null;
        } finally {
          setLoadingSearch(false);
        }
      };

      const handleSearch = useCallback(async (term) => {
        if (!term || term.length < 2) {
          setSearchResults([]);
          return;
        }
        setLoadingSearch(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`)
            .eq('is_published', true)
            .limit(10);
          if (error) throw error;
          setSearchResults(data || []);
        } catch (error) {
          console.error('Error searching products:', error);
          toast({ variant: "destructive", title: "Error de Búsqueda", description: "No se pudieron buscar productos." });
        } finally {
          setLoadingSearch(false);
        }
      }, [toast]);

      useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (searchTerm) {
            handleSearch(searchTerm);
          } else {
            setSearchResults([]);
          }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
      }, [searchTerm, handleSearch]);

      const handleBarcodeSubmit = async (e) => {
        e.preventDefault();
        if (barcodeScan) {
          const product = await fetchProductByBarcode(barcodeScan);
          if (product) {
            addToCart(product);
            setBarcodeScan(''); 
            if (barcodeInputRef.current) {
              barcodeInputRef.current.focus(); 
            }
          } else {
            toast({ variant: "warning", title: "No Encontrado", description: `Producto con código ${barcodeScan} no encontrado.` });
          }
        }
      };

      const addToCart = (product) => {
        if (product.stock === 0) {
          toast({ variant: "warning", title: "Agotado", description: `${product.name} está agotado.` });
          return;
        }
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.id === product.id);
          if (existingItem) {
            if (existingItem.quantity >= product.stock) {
              toast({ variant: "warning", title: "Stock Máximo", description: `No hay más stock disponible para ${product.name}.` });
              return prevCart;
            }
            return prevCart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prevCart, { ...product, quantity: 1 }];
        });
        setSearchTerm(''); 
        setSearchResults([]);
        if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        }
      };

      const updateQuantity = (productId, amount) => {
        setCart(prevCart =>
          prevCart.map(item => {
            if (item.id === productId) {
              const newQuantity = item.quantity + amount;
              if (newQuantity < 1) return null; 
              if (newQuantity > item.stock) {
                toast({ variant: "warning", title: "Stock Máximo", description: `No hay más stock disponible para ${item.name}.` });
                return { ...item, quantity: item.stock };
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          }).filter(Boolean)
        );
      };

      const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
      };

      const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const cartTax = cartSubtotal * 0.16; 
      const cartTotal = cartSubtotal + cartTax;

      const syncToMarketingContactsPOS = async (orderPayload) => {
        if (!orderPayload.accepts_marketing || !orderPayload.customer_email) return;

        const nameParts = orderPayload.customer_name?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        try {
          const { error } = await supabase
            .from('marketing_contacts')
            .upsert({
              email: orderPayload.customer_email,
              first_name: firstName,
              last_name: lastName,
              phone: orderPayload.shipping_address_phone, // Using phone from customerInfo for POS
              status: 'subscribed',
              tags: ['customer', 'pos_sale'],
              last_order_date: new Date().toISOString().split('T')[0],
              total_spent: orderPayload.total,
              updated_at: new Date().toISOString()
            }, { onConflict: 'email' });
          
          if (error) {
            console.error('Error syncing POS customer to marketing contacts:', error);
          } else {
            console.log('POS Customer synced to marketing contacts:', orderPayload.customer_email);
          }
        } catch (e) {
          console.error('Exception syncing POS customer to marketing contacts:', e);
        }
      };

      const handleFinalizeOrder = async () => {
        if (cart.length === 0) {
          toast({ variant: "destructive", title: "Carrito Vacío", description: "Añade productos al carrito." });
          return;
        }
        if (!customerInfo.name || !customerInfo.email) {
          toast({ variant: "destructive", title: "Datos del Cliente", description: "Ingresa nombre y email del cliente." });
          return;
        }
        setIsSubmittingOrder(true);
        try {
          let customerUserId = null;
          const { data: existingUserByEmail } = await supabase.from('users').select('id').eq('email', customerInfo.email).maybeSingle();
          
          if (existingUserByEmail) {
            customerUserId = existingUserByEmail.id;
          }

          const orderData = {
            user_id: customerUserId, 
            agent_id: agentUser.id,
            customer_name: customerInfo.name,
            customer_email: customerInfo.email,
            shipping_address_phone: customerInfo.phone || null, 
            status: 'completed', 
            payment_method: 'pos_terminal', 
            payment_status: 'paid',
            subtotal: cartSubtotal,
            tax_amount: cartTax,
            total: cartTotal,
            shipping_address_street: 'En Tienda', 
            billing_address_street: 'En Tienda',
            accepts_marketing: customerInfo.acceptsMarketing,
          };

          const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();
          if (orderError) throw orderError;

          const orderItemsData = cart.map(item => ({
            order_id: newOrder.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            product_name: item.name,
            product_image: (item.images && item.images.length > 0) ? item.images[0] : null,
            price_at_purchase: item.price,
            subtotal: item.price * item.quantity
          }));
          const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
          if (itemsError) {
            await supabase.from('orders').update({ status: 'error_items_failed', notes: `Error items: ${itemsError.message}`}).eq('id', newOrder.id);
            throw itemsError;
          }
          
          for (const item of cart) {
            await supabase.rpc('decrement_product_stock', { p_product_id: item.id, p_quantity: item.quantity });
          }

          if (customerUserId) {
            const pointsEarned = Math.floor(newOrder.total);
            await addLoyaltyPoints(customerUserId, pointsEarned, newOrder.id);
          }

          if (newOrder.accepts_marketing) {
            await syncToMarketingContactsPOS(newOrder);
          }

          toast({ title: "¡Venta Registrada!", description: `Pedido ${newOrder.id.substring(0,8)}... completado.` });
          setCart([]);
          setCustomerInfo({ name: '', email: '', phone: '', acceptsMarketing: false });
          setIsCheckoutModalOpen(false);
          setBarcodeScan('');
          if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
          }
        } catch (error) {
          console.error("Error finalizing order:", error);
          toast({ variant: "destructive", title: "Error en Venta", description: `No se pudo registrar la venta: ${error.message}` });
        } finally {
          setIsSubmittingOrder(false);
        }
      };
      
      useEffect(() => {
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }, []);

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto p-4 md:p-6 space-y-6"
        >
          <h1 className="text-3xl font-bold text-primary mb-6">Punto de Venta (TPV)</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Buscar Productos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                    <Input
                      ref={barcodeInputRef}
                      type="text"
                      placeholder="Escanear código de barras..."
                      value={barcodeScan}
                      onChange={(e) => setBarcodeScan(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit" variant="outline" size="icon" aria-label="Buscar por código de barras">
                      {loadingSearch && barcodeScan ? <Loader2 className="h-5 w-5 animate-spin" /> : <Barcode className="h-5 w-5"/>}
                    </Button>
                  </form>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="O buscar por nombre, descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loadingSearch && searchTerm && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
                      {searchResults.map(product => (
                        <div key={product.id} className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer" onClick={() => addToCart(product)}>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">${product.price} - Stock: {product.stock}</p>
                          </div>
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); addToCart(product);}} disabled={product.stock === 0}>Añadir</Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchTerm && searchResults.length === 0 && !loadingSearch && (
                      <p className="text-sm text-muted-foreground text-center py-2">No se encontraron productos.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center"><ShoppingBag className="mr-2 h-6 w-6 text-primary"/> Carrito</CardTitle>
                <CardDescription>Total Productos: {cart.reduce((sum, item) => sum + item.quantity, 0)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[calc(100vh-400px)] md:max-h-[400px] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">El carrito está vacío.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" title={item.name}>{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-7 w-7"><Minus className="h-4 w-4"/></Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)} className="h-7 w-7"><Plus className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive h-7 w-7"><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                  <div className="w-full flex justify-between font-semibold text-sm"><span>Subtotal:</span><span>${cartSubtotal.toFixed(2)}</span></div>
                  <div className="w-full flex justify-between font-semibold text-sm"><span>IVA (16%):</span><span>${cartTax.toFixed(2)}</span></div>
                  <div className="w-full flex justify-between text-xl font-bold text-primary mt-1"><span>Total:</span><span>${cartTotal.toFixed(2)}</span></div>
                  <Button className="w-full mt-4" size="lg" onClick={() => setIsCheckoutModalOpen(true)} disabled={cart.length === 0}>
                    <DollarSign className="mr-2 h-5 w-5"/> Proceder al Pago
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Finalizar Venta</DialogTitle>
                <DialogDescription>Ingresa los datos del cliente y confirma la venta.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="customerNamePos">Nombre del Cliente</Label>
                  <Input id="customerNamePos" value={customerInfo.name} onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))} />
                </div>
                <div>
                  <Label htmlFor="customerEmailPos">Email del Cliente</Label>
                  <Input id="customerEmailPos" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))} />
                </div>
                <div>
                  <Label htmlFor="customerPhonePos">Teléfono (Opcional)</Label>
                  <Input id="customerPhonePos" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))} />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="acceptsMarketingPos" 
                    checked={customerInfo.acceptsMarketing} 
                    onCheckedChange={(checked) => setCustomerInfo(prev => ({...prev, acceptsMarketing: checked}))}
                  />
                  <Label htmlFor="acceptsMarketingPos" className="text-sm font-normal">
                    El cliente acepta recibir marketing.
                  </Label>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-lg font-bold text-right">Total a Pagar: <span className="text-primary">${cartTotal.toFixed(2)}</span></p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCheckoutModalOpen(false)} disabled={isSubmittingOrder}>Cancelar</Button>
                <Button type="button" onClick={handleFinalizeOrder} disabled={isSubmittingOrder || cart.length === 0}>
                  {isSubmittingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <DollarSign className="mr-2 h-4 w-4"/>}
                  Confirmar Venta
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      );
    };

    export default AgentPOSPage;
  