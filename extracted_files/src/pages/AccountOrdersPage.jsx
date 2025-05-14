
    import React, { useEffect, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { useAuth } from '@/contexts/AuthContext';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { ShoppingBag, Package, CalendarDays, Eye, Loader2, AlertTriangle, ListOrdered } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';

    const AccountOrdersPage = () => {
      const { user } = useAuth();
      const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchOrders = async () => {
          if (!user) {
            setLoading(false);
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const { data, error: dbError } = await supabase
              .from('orders')
              .select(`
                id,
                created_at,
                status,
                total,
                payment_status,
                order_items (
                  product_name,
                  quantity,
                  product_image
                )
              `)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (dbError) throw dbError;
            setOrders(data || []);
          } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "No se pudieron cargar tus pedidos.");
          } finally {
            setLoading(false);
          }
        };

        fetchOrders();
      }, [user]);

      const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
          case 'pending_payment': return 'destructive';
          case 'processing': return 'warning';
          case 'shipped': return 'info';
          case 'delivered': return 'success';
          case 'cancelled': return 'outline';
          default: return 'secondary';
        }
      };
      
      const getPaymentStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
          case 'pending': return 'warning';
          case 'paid': return 'success';
          case 'failed': return 'destructive';
          default: return 'secondary';
        }
      };


      if (loading) {
        return (
          <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-300px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
      }

      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Error al Cargar Pedidos</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild><Link to="/">Volver al Inicio</Link></Button>
          </div>
        );
      }
      
      if (!user) {
         return (
          <div className="container mx-auto px-4 py-12 text-center">
            <ListOrdered className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Mis Pedidos</h2>
            <p className="text-muted-foreground mb-6">Por favor, <Link to="/auth?tab=login&redirect=/account/orders" className="underline text-primary hover:text-primary/80">inicia sesión</Link> para ver tu historial de pedidos.</p>
          </div>
        );
      }

      if (orders.length === 0) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-3">No Tienes Pedidos Aún</h2>
            <p className="text-muted-foreground mb-6">Parece que no has realizado ninguna compra. ¡Explora nuestros productos!</p>
            <Button asChild size="lg"><Link to="/products">Descubrir Productos</Link></Button>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 md:py-12"
        >
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Mis Pedidos</h1>
            <p className="text-muted-foreground">Aquí puedes ver el historial de todas tus compras.</p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
                  <CardHeader className="bg-muted/30 dark:bg-muted/10 p-4 md:p-6 rounded-t-lg">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle className="text-lg md:text-xl">Pedido #{order.id.substring(0, 8)}...</CardTitle>
                        <CardDescription className="text-xs md:text-sm flex items-center mt-1">
                          <CalendarDays className="h-3.5 w-3.5 mr-1.5" /> 
                          {format(parseISO(order.created_at), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-1">
                         <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize text-xs px-2 py-0.5">{order.status || 'Desconocido'}</Badge>
                         <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)} className="capitalize text-xs px-2 py-0.5">Pago: {order.payment_status || 'N/A'}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center"><Package className="h-4 w-4 mr-2 text-primary"/>Productos:</h4>
                      <ul className="space-y-2">
                        {order.order_items && order.order_items.slice(0, 2).map((item, index) => (
                           <li key={index} className="flex items-center text-xs text-muted-foreground">
                             <img  class="w-10 h-10 object-cover rounded-sm mr-2" alt={item.product_name} src="https://images.unsplash.com/photo-1674027392838-d85710a5121d" />
                            <span>{item.product_name} (x{item.quantity})</span>
                          </li>
                        ))}
                        {order.order_items && order.order_items.length > 2 && (
                          <li className="text-xs text-muted-foreground italic ml-12">+ {order.order_items.length - 2} más...</li>
                        )}
                      </ul>
                    </div>
                    <p className="text-lg font-semibold text-right">Total: <span className="text-primary">${parseFloat(order.total || 0).toFixed(2)}</span></p>
                  </CardContent>
                  <CardFooter className="p-4 md:p-6 bg-muted/30 dark:bg-muted/10 rounded-b-lg flex justify-end">
                    <Button asChild variant="default" size="sm">
                      <Link to={`/order-confirmation/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    };

    export default AccountOrdersPage;
  