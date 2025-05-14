
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useCart } from '@/contexts/CartContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
    import { Trash2, PlusCircle, MinusCircle, ShoppingBag, CreditCard } from 'lucide-react';
    import { motion } from 'framer-motion';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const CartPage = () => {
      const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
      const navigate = useNavigate();

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      };

      const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      };

      const handleCheckout = () => {
        // Later, this will check if user is authenticated.
        // For now, just navigate.
        navigate('/checkout');
      };

      if (cartItems.length === 0) {
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container py-12 text-center animate-fadeIn"
          >
            <ShoppingBag className="h-24 w-24 mx-auto text-primary mb-6" />
            <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">Parece que no has añadido ningún producto a tu carrito todavía.</p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/products">Explorar Productos</Link>
            </Button>
          </motion.div>
        );
      }

      return (
        <div className="container py-8 md:py-12 animate-fadeIn">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              Tu Carrito de Compras
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Revisa tus productos y procede al pago.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2 bg-card p-6 rounded-lg shadow-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Productos ({cartCount})</h2>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={cartItems.length === 0}>
                      <Trash2 className="mr-2 h-4 w-4" /> Vaciar Carrito
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará todos los productos de tu carrito. No podrás deshacer esto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart} className="bg-destructive hover:bg-destructive/90">Sí, vaciar carrito</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] hidden md:table-cell">Imagen</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-center">Quitar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map(item => (
                    <motion.tr key={item.id} variants={itemVariants} className="border-b border-border hover:bg-muted/20">
                      <TableCell className="hidden md:table-cell">
                        <Link to={`/products/${item.id}`}>
                          <img  src={(item.images && item.images.length > 0 && item.images[0]) ? item.images[0] : 'https://images.unsplash.com/photo-1580902214608-5a54907c1b92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80'} alt={item.name} className="w-16 h-16 object-cover rounded-md" src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/products/${item.id}`} className="hover:text-primary">{item.name}</Link>
                        <p className="text-xs text-muted-foreground md:hidden">Precio: ${item.price ? item.price.toFixed(2) : '0.00'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7">
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-center bg-transparent border-border focus:border-primary"
                            min="1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">${item.price ? item.price.toFixed(2) : '0.00'}</TableCell>
                      <TableCell className="text-right font-semibold">${(item.price && item.quantity ? item.price * item.quantity : 0).toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
                 {cartItems.length === 0 && (
                  <TableCaption>Tu carrito está vacío.</TableCaption>
                )}
              </Table>
            </motion.div>

            <motion.div 
              className="lg:col-span-1 bg-card p-6 rounded-lg shadow-xl h-fit sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4 border-border">Resumen del Pedido</h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cartCount} productos):</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-medium">Gratis (promoción)</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4 border-border">
                  <span className="text-lg font-bold text-primary">Total:</span>
                  <span className="text-xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" onClick={handleCheckout}>
                <CreditCard className="mr-2 h-5 w-5" /> Proceder al Pago
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Serás redirigido a una pasarela de pago segura.
              </p>
              <Button variant="link" asChild className="w-full mt-4 text-primary">
                <Link to="/products">Continuar Comprando</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      );
    };

    export default CartPage;
  