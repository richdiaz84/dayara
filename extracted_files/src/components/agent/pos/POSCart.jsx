
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Separator } from '@/components/ui/separator';
    import { PlusCircle, MinusCircle, Trash2, ShoppingBag } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const POSCart = ({ cart, onUpdateQuantity, onRemoveFromCart, onProceedToCheckout }) => {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxRate = 0.12; 
      const taxes = subtotal * taxRate;
      const total = subtotal + taxes;

      const formatCurrency = (amount) => {
        return `Q${amount.toFixed(2)}`;
      };

      return (
        <Card className="shadow-lg sticky top-6 bg-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-primary">
              <ShoppingBag className="mr-2 h-6 w-6" /> Carrito de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tu carrito está vacío.</p>
            ) : (
              <ScrollArea className="h-[300px] pr-3">
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-2 rounded-md bg-background hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                           <img  
                              className="h-10 w-10 rounded object-cover flex-shrink-0" 
                              alt={item.name}
                             src={item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1638428355339-3ae4ae63bf4e"} />
                          <div className="flex-grow min-w-0">
                            <p className="font-medium text-sm truncate text-foreground" title={item.name}>{item.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} x {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => onUpdateQuantity(item.id, -1)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => onUpdateQuantity(item.id, 1)}>
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onRemoveFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border">
              <div className="w-full flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="w-full flex justify-between text-sm">
                <span className="text-muted-foreground">IVA ({ (taxRate * 100).toFixed(0) }%):</span>
                <span className="font-medium text-foreground">{formatCurrency(taxes)}</span>
              </div>
              <Separator />
              <div className="w-full flex justify-between text-lg font-bold">
                <span className="text-primary">Total:</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
              <Button 
                size="lg" 
                className="w-full mt-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md" 
                onClick={onProceedToCheckout}
              >
                Proceder al Pago
              </Button>
            </CardFooter>
          )}
        </Card>
      );
    };
    export default POSCart;
  