
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { useComparison } from '@/contexts/ComparisonContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { X, Trash2, ShoppingCart, Info, Layers } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useCart } from '@/contexts/CartContext';

    const CompareProductsPage = () => {
      const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
      const { addToCart } = useCart();

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      };

      if (comparisonItems.length === 0) {
        return (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center"
          >
            <Layers className="h-24 w-24 text-primary mb-6" />
            <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-4 text-foreground">Tu Lista de Comparación está Vacía</motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground mb-8 max-w-md">
              Añade productos a tu lista de comparación para ver sus características lado a lado y tomar la mejor decisión.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button asChild size="lg">
                <Link to="/products">Explorar Productos</Link>
              </Button>
            </motion.div>
          </motion.div>
        );
      }

      const features = ['Precio', 'Categoría', 'Stock', 'Descripción']; // Add more features as needed

      return (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="container mx-auto px-2 sm:px-4 py-8 md:py-12"
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Comparar Productos</h1>
            {comparisonItems.length > 0 && (
              <Button variant="outline" onClick={clearComparison} className="border-destructive text-destructive hover:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Limpiar Lista ({comparisonItems.length})
              </Button>
            )}
          </motion.div>

          {comparisonItems.length > 0 ? (
            <motion.div variants={itemVariants} className="overflow-x-auto bg-card p-4 sm:p-6 rounded-lg shadow-xl">
              <Table className="min-w-max sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] sm:w-[200px] font-semibold text-foreground text-base sticky left-0 bg-card z-10">Característica</TableHead>
                    {comparisonItems.map(product => (
                      <TableHead key={product.id} className="w-[200px] sm:w-[250px] text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Link to={`/products/${product.id}`}>
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]}
                                alt={product.name}
                                className="h-24 w-24 object-cover rounded-md border"
                               src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                            ) : (
                              <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                <Layers size={32} />
                              </div>
                            )}
                          </Link>
                          <Link to={`/products/${product.id}`} className="font-medium text-primary hover:underline text-sm text-center line-clamp-2">{product.name}</Link>
                          <Button variant="ghost" size="sm" onClick={() => removeFromComparison(product.id)} className="text-muted-foreground hover:text-destructive px-2 h-auto py-1">
                            <X className="h-3 w-3 mr-1" /> Quitar
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map(feature => (
                    <TableRow key={feature}>
                      <TableCell className="font-semibold text-foreground sticky left-0 bg-card z-10">{feature}</TableCell>
                      {comparisonItems.map(product => (
                        <TableCell key={product.id} className="text-center text-sm text-muted-foreground align-top">
                          {feature === 'Precio' && `$${parseFloat(product.price).toFixed(2)}`}
                          {feature === 'Categoría' && (product.category || 'N/A')}
                          {feature === 'Stock' && (product.stock > 0 ? `${product.stock} disponibles` : <span className="text-destructive font-medium">Agotado</span>)}
                          {feature === 'Descripción' && <p className="line-clamp-4 text-xs">{product.description || 'N/A'}</p>}
                          {/* Add more product properties here */}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="sticky left-0 bg-card z-10"></TableCell>
                    {comparisonItems.map(product => (
                      <TableCell key={product.id} className="text-center">
                        <Button 
                          size="sm" 
                          onClick={() => addToCart(product, 1)} 
                          disabled={product.stock === 0}
                          className="w-full"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> {product.stock > 0 ? 'Añadir' : 'Agotado'}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </motion.div>
          ) : null}
        </motion.div>
      );
    };

    export default CompareProductsPage;
  