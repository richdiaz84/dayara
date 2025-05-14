
    import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { Edit, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
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

    const AdminProductTable = ({ products, onEdit, onDelete, isLoading }) => {
      const [productToDelete, setProductToDelete] = useState(null);

      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
          day: '2-digit', month: 'short', year: 'numeric'
        });
      };

      const rowVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.05,
          },
        }),
        exit: { opacity: 0, x: -20 },
      };

      if (isLoading && products.length === 0) {
        return (
          <div className="text-center py-10 text-muted-foreground">
            Cargando productos...
          </div>
        );
      }

      return (
        <>
          <div className="rounded-lg border overflow-hidden bg-card shadow">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/10">
                  <TableHead className="w-[80px] hidden sm:table-cell">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="hidden lg:table-cell">Precio</TableHead>
                  <TableHead className="hidden lg:table-cell">Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="hidden sm:table-cell">Actualizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="hover:bg-muted/5 transition-colors"
                    >
                      <TableCell className="hidden sm:table-cell">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover shadow"
                           src="https://images.unsplash.com/photo-1700422052492-cb12c619a352" />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                            <EyeOff size={20} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground py-3 pr-2">
                        {product.name}
                        <div className="text-xs text-muted-foreground md:hidden">{product.category} - ${product.price}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{product.category}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">${product.price?.toFixed(2)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={product.is_published ? 'default' : 'outline'} className={product.is_published ? 'bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-500/30' : 'border-amber-500/30 text-amber-700 dark:text-amber-400'}>
                          {product.is_published ? <><Eye className="mr-1 h-3 w-3"/> Publicado</> : <><EyeOff className="mr-1 h-3 w-3"/> Oculto</>}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{formatDate(product.updated_at)}</TableCell>
                      <TableCell className="text-right py-3 pl-2">
                        <div className="flex justify-end items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" onClick={() => setProductToDelete(product)} className="text-destructive hover:text-red-600 hover:bg-red-500/10 h-8 w-8">
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </AlertDialogTrigger>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          
          <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="text-destructive mr-2 h-6 w-6" />
                  ¿Estás seguro de eliminar este producto?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Estás a punto de eliminar el producto "<strong>{productToDelete?.name}</strong>".
                  Esta acción no se puede deshacer y también eliminará todas las imágenes asociadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => {
                    if (productToDelete) {
                      onDelete(productToDelete);
                    }
                    setProductToDelete(null);
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Sí, eliminar producto
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    };

    export default AdminProductTable;
  