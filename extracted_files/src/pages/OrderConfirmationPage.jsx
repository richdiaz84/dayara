
    import React from 'react';
    import { Link, useParams, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import OrderSummaryDetails from '@/components/order/OrderSummaryDetails';
    import OrderShippingDetails from '@/components/order/OrderShippingDetails';
    import OrderCustomerInfo from '@/components/order/OrderCustomerInfo';
    import { useOrderDetails } from '@/hooks/useOrderDetails';

    const OrderConfirmationPage = () => {
      const { orderId } = useParams();
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const newOrderSession = queryParams.get('new_order_session');
      
      const { order, loading, error, isNewlyConfirmed } = useOrderDetails(orderId, newOrderSession);

      if (loading) {
        return (
          <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Cargando confirmación de tu pedido...</p>
          </div>
        );
      }
      
      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-semibold mb-3">Error en la Confirmación</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild><Link to="/">Volver al Inicio</Link></Button>
          </div>
        );
      }
      
      if (!order) {
        return (
           <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-3">Pedido no disponible</h1>
            <p className="text-muted-foreground mb-6">No pudimos encontrar los detalles de este pedido.</p>
            <Button asChild><Link to="/">Volver al Inicio</Link></Button>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12"
        >
          <Card className="max-w-2xl mx-auto shadow-xl border-primary/30">
            <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-background p-8 rounded-t-lg">
              <CheckCircle className="h-20 w-20 mx-auto text-primary mb-4" />
              <CardTitle className="text-3xl font-bold text-primary">
                {isNewlyConfirmed ? "¡Gracias por tu Pedido!" : "Detalles del Pedido"}
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                {isNewlyConfirmed 
                  ? "Tu compra ha sido confirmada. Hemos enviado un resumen a tu correo electrónico." 
                  : `Visualizando los detalles del pedido #${order.id.substring(0, 8)}...`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <OrderCustomerInfo order={order} />
              <OrderSummaryDetails 
                orderItems={order.order_items} 
                total={order.total} 
                subtotal={order.subtotal} 
                shippingCost={order.shipping_cost} 
                discount={order.discount_amount}
                taxes={order.tax_amount}
              />
              <OrderShippingDetails 
                street={order.shipping_address_street}
                city={order.shipping_address_city}
                state={order.shipping_address_state}
                zip={order.shipping_address_zip}
                country={order.shipping_address_country}
                phone={order.shipping_address_phone}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-4 p-6 bg-muted/20 rounded-b-lg">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Link to="/products">Seguir Comprando</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/account/orders">Ver Mis Pedidos</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default OrderConfirmationPage;
  