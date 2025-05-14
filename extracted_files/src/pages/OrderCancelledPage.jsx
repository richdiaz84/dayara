
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
    import { motion } from 'framer-motion';

    const OrderCancelledPage = () => {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]"
        >
          <Card className="max-w-md w-full text-center shadow-xl border-destructive/50 bg-destructive/5 dark:bg-destructive/10">
            <CardHeader className="pt-10">
              <XCircle className="h-20 w-20 mx-auto text-destructive mb-4" />
              <CardTitle className="text-3xl font-bold text-destructive">Pago Cancelado</CardTitle>
              <CardDescription className="text-md text-destructive/80 dark:text-destructive/70 pt-2">
                Parece que has cancelado el proceso de pago.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Tu pedido no ha sido completado. Si esto fue un error, puedes intentar finalizar la compra nuevamente desde tu carrito.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Link to="/cart">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Volver al Carrito
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Seguir Comprando
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default OrderCancelledPage;
  