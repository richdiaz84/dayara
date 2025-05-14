
    import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { Loader2, PlusCircle, Search, Trash2, UserPlus, XCircle } from 'lucide-react';

    const AdminManualOrderForm = ({ onOrderCreated, onCancel }) => {
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      
      const [customerEmail, setCustomerEmail] = useState('');
      const [customerName, setCustomerName] = useState('');
      const [customerPhone, setCustomerPhone] = useState('');
      const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'Guatemala' });
      const [foundCustomer, setFoundCustomer] = useState(null);
      const [isNewCustomer, setIsNewCustomer] = useState(false);
      const [searchingCustomer, setSearchingCustomer] = useState(false);

      const [orderItems, setOrderItems] = useState([]);
      const [products, setProducts] = useState([]);
      const [productSearchTerm, setProductSearchTerm] = useState('');
      const [searchedProducts, setSearchedProducts] = useState([]);
      
      const [paymentMethod, setPaymentMethod] = useState('efectivo_manual');
      const [paymentStatus, setPaymentStatus] = useState('pendiente');
      const [orderStatus, setOrderStatus] = useState('pendiente');
      const [notes, setNotes] = useState('');

      const formatCurrency = (amount) => `Q${parseFloat(amount || 0).toFixed(2)}`;

      const fetchAllProducts = useCallback(async () => {
        const { data, error } = await supabase.from('products').select('id, name, price, stock, images').eq('is_published', true);
        if (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
        } else {
          setProducts(data || []);
        }
      }, [toast]);

      useEffect(() => {
        fetchAllProducts();
      }, [fetchAllProducts]);

      const handleSearchCustomer = async () => {
        if (!customerEmail) {
          toast({ variant: "warning", title: "Email requerido", description: "Por favor, ingresa un email para buscar." });
          return;
        }
        setSearchingCustomer(true);
        setFoundCustomer(null);
        setIsNewCustomer(false);

        const { data, error } = await supabase
          .from('users')
          .select('id, email, raw_user_meta_data->>full_name as full_name, raw_user_meta_data->>phone as phone')
          .eq('email', customerEmail)
          .maybeSingle();
        
        setSearchingCustomer(false);
        if (error) {
          toast({ variant: "destructive", title: "Error", description: "Error al buscar cliente." });
        } else if (data) {
          setFoundCustomer(data);
          setCustomerName(data.full_name || '');
          setCustomerPhone(data.phone || '');
          toast({ title: "Cliente Encontrado", description: `Cliente: ${data.full_name || data.email}` });
        } else {
          toast({ variant: "info", title: "Cliente No Encontrado", description: "Puedes registrarlo como nuevo cliente." });
          setIsNewCustomer(true);
          setCustomerName('');
          setCustomerPhone('');
        }
      };

      const handleProductSearch = (term) => {
        setProductSearchTerm(term);
        if (!term || term.length < 2) {
          setSearchedProducts([]);
          return;
        }
        const filtered = products.filter(p => 
          p.name.toLowerCase().includes(term.toLowerCase()) || 
          p.id.toLowerCase().includes(term.toLowerCase())
        ).slice(0, 5);
        setSearchedProducts(filtered);
      };

      const addProductToOrder = (product) => {
        const existingItem = orderItems.find(item => item.product_id === product.id);
        if (existingItem) {
          if (existingItem.quantity < product.stock) {
            setOrderItems(orderItems.map(item => 
              item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
          } else {
            toast({ variant: "warning", title: "Stock Insuficiente", description: `No hay más stock para ${product.name}`});
          }
        } else {
          if (product.stock > 0) {
            setOrderItems([...orderItems, { product_id: product.id, name: product.name, quantity: 1, price: product.price, stock: product.stock, image: product.images ? product.images[0] : null }]);
          } else {
            toast({ variant: "warning", title: "Agotado", description: `${product.name} está agotado.`});
          }
        }
        setProductSearchTerm('');
        setSearchedProducts([]);
      };

      const updateOrderItemQuantity = (productId, newQuantity) => {
        const productInOrder = orderItems.find(item => item.product_id === productId);
        if (!productInOrder) return;

        if (newQuantity < 1) {
          removeOrderItem(productId);
          return;
        }
        if (newQuantity > productInOrder.stock) {
          toast({ variant: "warning", title: "Stock Insuficiente", description: `Máximo ${productInOrder.stock} unidades para ${productInOrder.name}`});
          setOrderItems(orderItems.map(item => 
            item.product_id === productId ? { ...item, quantity: productInOrder.stock } : item
          ));
          return;
        }
        setOrderItems(orderItems.map(item => 
          item.product_id === productId ? { ...item, quantity: newQuantity } : item
        ));
      };

      const removeOrderItem = (productId) => {
        setOrderItems(orderItems.filter(item => item.product_id !== productId));
      };

      const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxRate = 0.12; // IVA Guatemala
      const taxes = subtotal * taxRate;
      const total = subtotal + taxes;

      const handleSubmitOrder = async () => {
        if (orderItems.length === 0) {
          toast({ variant: "warning", title: "Pedido Vacío", description: "Añade productos al pedido." });
          return;
        }
        if (!customerName && !foundCustomer) {
            toast({ variant: "warning", title: "Cliente Requerido", description: "Busca un cliente existente o ingresa los datos de un nuevo cliente." });
            return;
        }

        setIsLoading(true);

        const orderPayload = {
          user_id: foundCustomer ? foundCustomer.id : null,
          customer_name: customerName || (foundCustomer ? foundCustomer.full_name : 'Cliente Manual'),
          customer_email: customerEmail || (foundCustomer ? foundCustomer.email : 'manual@pedido.com'),
          customer_phone: customerPhone || (foundCustomer ? foundCustomer.phone : null),
          shipping_address_street: shippingAddress.street,
          shipping_address_city: shippingAddress.city,
          shipping_address_state: shippingAddress.state,
          shipping_address_zip: shippingAddress.zip,
          shipping_address_country: shippingAddress.country,
          subtotal: subtotal,
          tax_amount: taxes,
          total: total,
          shipping_cost: 0, // Asumir envío gratis o a definir
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          status: orderStatus,
          notes: notes,
          agent_id: supabase.auth.user()?.id, // Assuming admin user is the agent
        };

        try {
          const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert(orderPayload)
            .select()
            .single();

          if (orderError) throw orderError;

          const orderItemsPayload = orderItems.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
          if (itemsError) throw itemsError;
          
          // Decrement stock (optional, depends on workflow for manual orders)
          for (const item of orderItems) {
            await supabase.rpc('decrement_product_stock', {
              product_id_param: item.product_id,
              quantity_param: item.quantity,
            });
          }

          toast({ title: "Pedido Creado", description: "El pedido manual ha sido creado exitosamente." });
          onOrderCreated(newOrder);
          onCancel();

        } catch (error) {
          toast({ variant: "destructive", title: "Error al Crear Pedido", description: error.message });
        } finally {
          setIsLoading(false);
        }
      };


      return (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Crear Pedido Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-[calc(100vh-300px)] p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer Section */}
              <section className="space-y-3 p-4 border rounded-md">
                <h3 className="text-lg font-semibold">Información del Cliente</h3>
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Label htmlFor="customerEmailSearch">Email del Cliente</Label>
                    <Input id="customerEmailSearch" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="cliente@ejemplo.com" className="bg-input"/>
                  </div>
                  <Button onClick={handleSearchCustomer} disabled={searchingCustomer || !customerEmail} variant="outline">
                    {searchingCustomer ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                  </Button>
                </div>
                {foundCustomer && <p className="text-sm text-green-600">Cliente encontrado: {foundCustomer.full_name || foundCustomer.email}</p>}
                {(isNewCustomer || !foundCustomer) && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="customerName">Nombre Cliente</Label>
                    <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nombre Completo" className="bg-input"/>
                    {!foundCustomer && isNewCustomer && <>
                        <Label htmlFor="customerPhone">Teléfono Cliente</Label>
                        <Input id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Número de teléfono" className="bg-input"/>
                    </>}
                  </div>
                )}
              </section>

              {/* Shipping Section */}
              <section className="space-y-3 p-4 border rounded-md">
                <h3 className="text-lg font-semibold">Dirección de Envío</h3>
                <Input value={shippingAddress.street} onChange={(e) => setShippingAddress(s => ({...s, street: e.target.value}))} placeholder="Calle y Número" className="bg-input"/>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={shippingAddress.city} onChange={(e) => setShippingAddress(s => ({...s, city: e.target.value}))} placeholder="Ciudad" className="bg-input"/>
                  <Input value={shippingAddress.state} onChange={(e) => setShippingAddress(s => ({...s, state: e.target.value}))} placeholder="Departamento/Estado" className="bg-input"/>
                </div>
                 <div className="grid grid-cols-2 gap-2">
                    <Input value={shippingAddress.zip} onChange={(e) => setShippingAddress(s => ({...s, zip: e.target.value}))} placeholder="Código Postal" className="bg-input"/>
                    <Input value={shippingAddress.country} onChange={(e) => setShippingAddress(s => ({...s, country: e.target.value}))} placeholder="País" className="bg-input"/>
                 </div>
              </section>
            </div>

            {/* Products Section */}
            <section className="space-y-3 p-4 border rounded-md">
                <h3 className="text-lg font-semibold">Productos del Pedido</h3>
                <div className="relative">
                    <Input 
                        type="text" 
                        placeholder="Buscar producto por nombre o ID..." 
                        value={productSearchTerm}
                        onChange={(e) => handleProductSearch(e.target.value)}
                        className="bg-input pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     {searchedProducts.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                            <CardContent className="p-2">
                                {searchedProducts.map(p => (
                                    <div key={p.id} onClick={() => addProductToOrder(p)} className="p-2 hover:bg-muted cursor-pointer rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{formatCurrency(p.price)} - Stock: {p.stock}</p>
                                        </div>
                                        <Button size="sm" variant="ghost"><PlusCircle className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {orderItems.length > 0 && (
                    <Table>
                        <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Precio</TableHead><TableHead>Cantidad</TableHead><TableHead>Subtotal</TableHead><TableHead></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {orderItems.map(item => (
                                <TableRow key={item.product_id}>
                                    <TableCell className="flex items-center gap-2">
                                       <img  src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="h-10 w-10 object-cover rounded"/>
                                       {item.name}
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => updateOrderItemQuantity(item.product_id, parseInt(e.target.value))}
                                            min="1"
                                            max={item.stock}
                                            className="w-20 bg-input"
                                        />
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeOrderItem(item.product_id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <div className="text-right mt-4 space-y-1">
                    <p>Subtotal: <span className="font-semibold">{formatCurrency(subtotal)}</span></p>
                    <p>IVA (12%): <span className="font-semibold">{formatCurrency(taxes)}</span></p>
                    <p className="text-lg">Total: <span className="font-bold text-primary">{formatCurrency(total)}</span></p>
                </div>
            </section>

            {/* Order Details Section */}
            <section className="space-y-3 p-4 border rounded-md">
                 <h3 className="text-lg font-semibold">Detalles del Pedido</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="paymentMethod">Método de Pago</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="efectivo_manual">Efectivo (Manual)</SelectItem>
                                <SelectItem value="tarjeta_manual">Tarjeta (Manual)</SelectItem>
                                <SelectItem value="transferencia_manual">Transferencia (Manual)</SelectItem>
                                <SelectItem value="otro_manual">Otro (Manual)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="paymentStatus">Estado de Pago</Label>
                         <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                            <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="pagado">Pagado</SelectItem>
                                <SelectItem value="parcialmente_pagado">Parcialmente Pagado</SelectItem>
                                <SelectItem value="reembolsado">Reembolsado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="orderStatus">Estado del Pedido</Label>
                        <Select value={orderStatus} onValueChange={setOrderStatus}>
                            <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="procesando">Procesando</SelectItem>
                                <SelectItem value="enviado">Enviado</SelectItem>
                                <SelectItem value="completado">Completado</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Instrucciones especiales, comentarios, etc." className="bg-input"/>
                </div>
            </section>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
            <Button onClick={handleSubmitOrder} disabled={isLoading || orderItems.length === 0}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <PlusCircle className="h-4 w-4 mr-2"/>}
              Crear Pedido
            </Button>
          </CardFooter>
        </Card>
      );
    };

    export default AdminManualOrderForm;
  