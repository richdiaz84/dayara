
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Loader2, PlusCircle, Trash2, Send, ShoppingCart, Info } from 'lucide-react';
    import { useNavigate, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';

    const RequestQuotePage = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const navigate = useNavigate();
      const [products, setProducts] = useState([]);
      const [quoteItems, setQuoteItems] = useState([{ product_id: '', quantity: 1, price: 0, name: '' }]);
      const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', notes: '' });
      const [loadingProducts, setLoadingProducts] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);

      useEffect(() => {
        const fetchProducts = async () => {
          setLoadingProducts(true);
          try {
            const { data, error } = await supabase
              .from('products')
              .select('id, name, price, stock')
              .eq('is_published', true)
              .order('name', { ascending: true });
            if (error) throw error;
            setProducts(data || []);
          } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
          } finally {
            setLoadingProducts(false);
          }
        };
        fetchProducts();
      }, [toast]);

      useEffect(() => {
        if (user) {
          setCustomerInfo(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
            email: user.email || ''
          }));
        }
      }, [user]);

      const handleItemChange = (index, field, value) => {
        const newItems = [...quoteItems];
        newItems[index][field] = value;
        if (field === 'product_id') {
          const selectedProduct = products.find(p => p.id === value);
          newItems[index].price = selectedProduct ? selectedProduct.price : 0;
          newItems[index].name = selectedProduct ? selectedProduct.name : '';
        }
        setQuoteItems(newItems);
      };

      const addItem = () => {
        setQuoteItems([...quoteItems, { product_id: '', quantity: 1, price: 0, name: '' }]);
      };

      const removeItem = (index) => {
        const newItems = quoteItems.filter((_, i) => i !== index);
        setQuoteItems(newItems);
      };

      const handleCustomerInfoChange = (field, value) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
      };

      const calculateTotal = () => {
        return quoteItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (quoteItems.some(item => !item.product_id || item.quantity < 1)) {
          toast({ variant: "destructive", title: "Items Inválidos", description: "Asegúrate de seleccionar un producto y cantidad válida para cada ítem." });
          return;
        }
        if (!customerInfo.name || !customerInfo.email) {
           toast({ variant: "destructive", title: "Información Requerida", description: "Por favor, ingresa tu nombre y correo electrónico." });
           return;
        }

        setIsSubmitting(true);
        const total = calculateTotal();
        try {
          const { data: quoteData, error: quoteError } = await supabase
            .from('quotes')
            .insert({
              user_id: user ? user.id : null,
              status: 'pending',
              total: total,
              // sales_agent_id can be assigned later by an admin/system
              // valid_until can be set upon approval
            })
            .select()
            .single();

          if (quoteError) throw quoteError;

          const itemsToInsert = quoteItems.map(item => ({
            quote_id: quoteData.id,
            product_id: item.product_id,
            product_name: item.name, // Store name at time of quote
            quantity: item.quantity,
            price: item.price, // Store price at time of quote
          }));

          const { error: itemsError } = await supabase.from('quote_items').insert(itemsToInsert);
          if (itemsError) {
            // Rollback quote creation if items fail
            await supabase.from('quotes').delete().eq('id', quoteData.id);
            throw itemsError;
          }

          // Create/Update user in auth.users if not logged in and email provided.
          // For now, we assume if a user is not logged in, the details are just for this quote.
          // Potentially, we could create a temporary user or associate the quote later.

          toast({ title: "Cotización Enviada", description: "Tu solicitud de cotización ha sido enviada. Te contactaremos pronto." });
          setQuoteItems([{ product_id: '', quantity: 1, price: 0, name: '' }]);
          // Clear customerInfo if not logged in? For now, keep it.
          navigate('/'); // Or a thank you page for quotes
        } catch (error) {
          console.error("Error submitting quote:", error);
          toast({ variant: "destructive", title: "Error al Enviar", description: `No se pudo enviar la cotización: ${error.message}` });
        } finally {
          setIsSubmitting(false);
        }
      };
      
      if (!user) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
            >
                <Card className="w-full max-w-md text-center shadow-xl">
                    <CardHeader>
                        <ShoppingCart className="h-16 w-16 mx-auto text-primary mb-4" />
                        <CardTitle className="text-2xl font-semibold">Solicitar Cotización</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-6">
                            Para solicitar una cotización personalizada, por favor inicia sesión o crea una cuenta. Esto nos ayudará a guardar tu historial y ofrecerte un mejor servicio.
                        </CardDescription>
                        <Button asChild className="w-full">
                            <Link to="/auth?redirect=/request-quote">Iniciar Sesión / Registrarse</Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">Si prefieres, puedes contactarnos directamente.</p>
                    </CardContent>
                </Card>
            </motion.div>
        );
      }


      return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="container mx-auto px-4 py-8 md:py-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-primary">Solicitar Cotización</h1>
          
          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl mb-8">
              <CardHeader>
                <CardTitle>Tus Datos de Contacto</CardTitle>
                <CardDescription>Por favor, proporciona tu información para que podamos contactarte.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="customerName">Nombre Completo</Label>
                  <Input id="customerName" value={customerInfo.name} onChange={(e) => handleCustomerInfoChange('name', e.target.value)} required disabled={!!user}/>
                </div>
                <div>
                  <Label htmlFor="customerEmail">Correo Electrónico</Label>
                  <Input id="customerEmail" type="email" value={customerInfo.email} onChange={(e) => handleCustomerInfoChange('email', e.target.value)} required disabled={!!user}/>
                </div>
                <div>
                  <Label htmlFor="customerPhone">Teléfono (Opcional)</Label>
                  <Input id="customerPhone" type="tel" value={customerInfo.phone} onChange={(e) => handleCustomerInfoChange('phone', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customerNotes">Notas Adicionales (Opcional)</Label>
                  <Textarea id="customerNotes" value={customerInfo.notes} onChange={(e) => handleCustomerInfoChange('notes', e.target.value)} placeholder="Cualquier detalle o requerimiento especial..."/>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Productos a Cotizar</CardTitle>
                <CardDescription>Añade los productos y cantidades que deseas cotizar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quoteItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y:10 }} 
                    animate={{ opacity: 1, y:0 }} 
                    transition={{delay: index * 0.05}}
                    className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex-grow w-full md:w-auto">
                      <Label htmlFor={`product-${index}`}>Producto</Label>
                      {loadingProducts ? <Loader2 className="h-5 w-5 animate-spin mt-2"/> : (
                        <Select
                          value={item.product_id}
                          onValueChange={(value) => handleItemChange(index, 'product_id', value)}
                          required
                        >
                          <SelectTrigger id={`product-${index}`}>
                            <SelectValue placeholder="Selecciona un producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                                {p.name} {p.stock === 0 ? "(Agotado)" : `($${p.price})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="w-full md:w-28">
                      <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value,10) || 1)}
                        required
                        className="text-center"
                      />
                    </div>
                    <div className="w-full md:w-32 text-right md:text-left">
                      <Label>Subtotal</Label>
                      <p className="font-semibold text-lg text-primary mt-1.5">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    {quoteItems.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-destructive hover:bg-destructive/10 self-center md:self-end">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                <Button type="button" variant="outline" onClick={addItem} className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Producto
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t">
                <div className="text-2xl font-bold text-foreground">
                  Total Estimado: <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting || loadingProducts}>
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitud de Cotización'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </motion.div>
      );
    };

    export default RequestQuotePage;
  