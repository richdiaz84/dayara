
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Separator } from '@/components/ui/separator';
    import { Link } from 'react-router-dom';

    const OrderSummaryDetails = ({ orderItems, total, subtotal, shippingCost, discount, taxes }) => {
      return (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderItems?.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm py-2 border-b border-border/50 last:border-b-0">
                <div className="flex items-start">
                  <img 
                    src={item.product_image || 'https://via.placeholder.com/64?text=Producto'} 
                    alt={item.product_name} 
                    className="w-16 h-16 object-cover rounded-md mr-4" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=No+Img'}
                  />
                  <div>
                    <Link to={`/products/${item.product_id}`} className="font-medium text-foreground hover:text-primary transition-colors block">
                      {item.product_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    <p className="text-xs text-muted-foreground">Precio Unit.: ${parseFloat(item.price_at_purchase).toFixed(2)}</p>
                  </div>
                </div>
                <p className="font-semibold text-foreground text-right min-w-[80px]">
                  ${parseFloat(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal:</p>
                <p className="font-medium">${parseFloat(subtotal).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Envío:</p>
                <p className="font-medium">${parseFloat(shippingCost).toFixed(2)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <p className="text-muted-foreground">Descuento:</p>
                  <p className="font-medium">-${parseFloat(discount).toFixed(2)}</p>
                </div>
              )}
               <div className="flex justify-between">
                <p className="text-muted-foreground">IVA ({(0.16 * 100).toFixed(0)}%):</p>
                <p className="font-medium">${parseFloat(taxes || 0).toFixed(2)}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-bold">
              <p className="text-primary">Total del Pedido:</p>
              <p className="text-primary">${parseFloat(total).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      );
    };

    export default OrderSummaryDetails;
  