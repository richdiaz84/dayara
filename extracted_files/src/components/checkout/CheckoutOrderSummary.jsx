
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Separator } from '@/components/ui/separator';
    import { ShoppingCart } from 'lucide-react';

    const CheckoutOrderSummary = ({ cartItems, cartTotal, cartCount, shippingCost, taxes, orderTotal }) => {
      return (
        <div className="space-y-6 sticky top-24">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center"><ShoppingCart className="mr-3 text-primary h-7 w-7"/>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-b-0">
                  <div className="flex items-center">
                    <img  src={(item.images && item.images.length > 0 && item.images[0]) ? item.images[0] : 'https://images.unsplash.com/photo-1618073841308-109f61e284f7'} alt={item.name} className="w-12 h-12 object-cover rounded-md mr-3" />
                    <div>
                      <p className="font-medium text-foreground truncate w-40" title={item.name}>{item.name}</p>
                      <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Subtotal ({cartCount} productos)</p>
                <p className="font-medium">${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Envío</p>
                <p className="font-medium">${shippingCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">IVA ({(0.16 * 100).toFixed(0)}%)</p>
                <p className="font-medium">${taxes.toFixed(2)}</p>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <p className="text-primary">Total</p>
                <p className="text-primary">${orderTotal.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    };

    export default CheckoutOrderSummary;
  