
    import React, { useState, useEffect, useCallback } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
    } from "@/components/ui/dialog";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Separator } from '@/components/ui/separator';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, CheckCircle, UserPlus, Search } from 'lucide-react';

    const POSCheckoutModal = ({ isOpen, onOpenChange, cart, cartTotal, onOrderSuccess }) => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [paymentMethod, setPaymentMethod] = useState('efectivo');
      const [amountReceived, setAmountReceived] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [isSuccess, setIsSuccess] = useState(false);
      const [change, setChange] = useState(0);
      
      const [customerEmail, setCustomerEmail] = useState('');
      const [customerName, setCustomerName] = useState('');
      const [foundCustomer, setFoundCustomer] = useState(null);
      const [searchingCustomer, setSearchingCustomer] = useState(false);
      const [newCustomer, setNewCustomer] = useState(false);

      const formatCurrency = (amount) => {
        return `Q${amount.toFixed(2)}`;
      };

      const handleAmountReceivedChange = (e) => {
        const value = e.target.value;
        setAmountReceived(value);
        if (paymentMethod === 'efectivo' && parseFloat(value) >= cartTotal) {
          setChange(parseFloat(value) - cartTotal);
        } else {
          setChange(0);
        }
      };
      
      const handleSearchCustomer = async () => {
        if (!customerEmail) {
            toast({ variant: "warning", title: "Email requerido", description: "Por favor, ingresa un email para buscar." });
            return;
        }
        setSearchingCustomer(true);
        setFoundCustomer(null);
        setNewCustomer(false);

        const { data, error } = await supabase
            .from('users') // Assuming you have a public users table or view synced with auth.users
            .select('id, email, raw_user_meta_data->>full_name as full_name') // Adjust if your profiles table is different
            .eq('email', customerEmail)
            .maybeSingle();
        
        setSearchingCustomer(false);
        if (error) {
            toast({ variant: "destructive", title: "Error", description: "Error al buscar cliente." });
        } else if (data) {
            setFoundCustomer(data);
            setCustomerName(data.full_name || '');
            toast({ title: "Cliente Encontrado", description: `Cliente: ${data.full_name || data.email}` });
        } else {
            toast({ variant: "info", title: "Cliente No Encontrado", description: "Puedes registrarlo como nuevo cliente." });
            setNewCustomer(true);
            setCustomerName('');
        }
      };


      const processOrder = async () => {
        setIsLoading(true);
        setIsSuccess(false);

        if (paymentMethod === 'efectivo' && (amountReceived === '' || parseFloat(amountReceived) < cartTotal)) {
            toast({ variant: "destructive", title: "Pago Insuficiente", description: "El monto recibido es menor al total." });
            setIsLoading(false);
            return;
        }
        if (newCustomer && (!customerName || !customerEmail)) {
          toast({ variant: "destructive", title: "Datos del Cliente Requeridos", description: "Nombre y email son requeridos para nuevo cliente." });
          setIsLoading(false);
          return;
        }


        let orderCustomerId = foundCustomer ? foundCustomer.id : null;
        let orderCustomerEmail = customerEmail || 'anonimo@pos.com';
        let orderCustomerName = customerName || 'Cliente POS';
        
        if (!foundCustomer && newCustomer && customerEmail && customerName) {
          orderCustomerEmail = customerEmail;
          orderCustomerName = customerName;
        } else if (!foundCustomer && !newCustomer && customerEmail) {
            orderCustomerEmail = customerEmail;
        }


        const orderData = {
          user_id: orderCustomerId, 
          agent_id: user?.id, 
          status: 'completado',
          total: cartTotal,
          subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          tax_amount: cartTotal - cart.reduce((sum, item) => sum + item.price * item.quantity, 0), // Assumes tax is included in cartTotal
          payment_method: paymentMethod,
          payment_status: 'pagado',
          customer_email: orderCustomerEmail,
          customer_name: orderCustomerName,
          notes: `Venta TPV por agente: ${user?.email}. Cliente: ${orderCustomerName} (${orderCustomerEmail})`,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        try {
          const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: orderData.user_id,
              agent_id: orderData.agent_id,
              status: orderData.status,
              total: orderData.total,
              subtotal: orderData.subtotal,
              tax_amount: orderData.tax_amount,
              payment_method: orderData.payment_method,
              payment_status: orderData.payment_status,
              customer_email: orderData.customer_email,
              customer_name: orderData.customer_name,
              notes: orderData.notes,
            })
            .select()
            .single();

          if (orderError) throw orderError;

          const orderItemsData = orderData.items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
          if (itemsError) throw itemsError;

          for (const item of cart) {
            const { error: stockError } = await supabase.rpc('decrement_product_stock', {
              product_id_param: item.id,
              quantity_param: item.quantity,
            });
            if (stockError) console.warn(`Error updating stock for ${item.name}: ${stockError.message}`);
          }
          
          setIsSuccess(true);
          toast({ title: "Pedido Completado", description: "La venta ha sido registrada exitosamente." });
          
          setTimeout(() => {
            onOrderSuccess();
            resetModalState();
          }, 2000);

        } catch (error) {
          toast({ variant: "destructive", title: "Error al Procesar Pedido", description: error.message });
        } finally {
          setIsLoading(false);
        }
      };
      
      const resetModalState = () => {
        setPaymentMethod('efectivo');
        setAmountReceived('');
        setIsLoading(false);
        setIsSuccess(false);
        setChange(0);
        setCustomerEmail('');
        setCustomerName('');
        setFoundCustomer(null);
        setNewCustomer(false);
        setSearchingCustomer(false);
      };

      useEffect(() => {
        if (isOpen) {
          resetModalState();
        }
      }, [isOpen]);
      
      useEffect(() => {
        if (paymentMethod !== 'efectivo') {
            setAmountReceived(cartTotal.toFixed(2));
            setChange(0);
        } else {
            setAmountReceived('');
        }
      }, [paymentMethod, cartTotal]);


      return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { onOpenChange(open); if (!open) resetModalState(); } }}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary">Finalizar Compra</DialogTitle>
              <DialogDescription>
                Confirma los detalles del pedido y el método de pago. Total: <span className="font-bold text-foreground">{formatCurrency(cartTotal)}</span>
              </DialogDescription>
            </DialogHeader>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground">¡Venta Exitosa!</h3>
                {change > 0 && paymentMethod === 'efectivo' && (
                  <p className="text-lg text-muted-foreground mt-2">Cambio a devolver: <span className="font-bold text-accent-foreground">{formatCurrency(change)}</span></p>
                )}
                <p className="text-muted-foreground mt-1">El pedido ha sido registrado.</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email del Cliente (Opcional)</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="customerEmail" 
                            type="email" 
                            value={customerEmail} 
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="cliente@ejemplo.com"
                            className="bg-input"
                            disabled={isLoading}
                        />
                        <Button onClick={handleSearchCustomer} disabled={searchingCustomer || isLoading} variant="secondary">
                            {searchingCustomer ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                        </Button>
                    </div>
                    {foundCustomer && (
                        <p className="text-sm text-green-600">Cliente: {foundCustomer.full_name || foundCustomer.email}</p>
                    )}
                     {newCustomer && !foundCustomer && (
                        <div className="mt-2 space-y-2 p-3 border rounded-md bg-background/50">
                             <p className="text-sm text-blue-600">Registrar nuevo cliente:</p>
                            <Input 
                                id="customerName" 
                                type="text" 
                                value={customerName} 
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Nombre completo del nuevo cliente"
                                className="bg-input"
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>


                <div>
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <div className="flex gap-2 mt-1">
                    {['efectivo', 'tarjeta', 'transferencia'].map(method => (
                      <Button
                        key={method}
                        variant={paymentMethod === method ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod(method)}
                        className="flex-1 capitalize"
                        disabled={isLoading}
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'efectivo' && (
                  <div className="space-y-1">
                    <Label htmlFor="amountReceived">Monto Recibido</Label>
                    <Input
                      id="amountReceived"
                      type="number"
                      value={amountReceived}
                      onChange={handleAmountReceivedChange}
                      placeholder="0.00"
                      className="bg-input"
                      disabled={isLoading}
                    />
                    {change > 0 && (
                      <p className="text-sm text-green-600 pt-1">Cambio a devolver: {formatCurrency(change)}</p>
                    )}
                  </div>
                )}

                <ScrollArea className="h-[150px] border rounded-md p-3 bg-background/30">
                  <h4 className="font-semibold mb-2 text-sm text-foreground">Resumen del Pedido:</h4>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate max-w-[180px]">{item.name} (x{item.quantity})</span>
                      <span className="text-foreground">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">{formatCurrency(cart.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                  </div>
                   <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">IVA (12%):</span>
                    <span className="text-foreground">{formatCurrency(cart.reduce((s, i) => s + i.price * i.quantity, 0) * 0.12)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-1">
                    <span className="text-primary">Total:</span>
                    <span className="text-primary">{formatCurrency(cartTotal)}</span>
                  </div>
                </ScrollArea>
              </div>
            )}

            {!isSuccess && (
              <DialogFooter>
                <Button variant="outline" onClick={() => { if (!isLoading) { onOpenChange(false); resetModalState(); } }} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button onClick={processOrder} className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Venta"}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      );
    };

    export default POSCheckoutModal;
  