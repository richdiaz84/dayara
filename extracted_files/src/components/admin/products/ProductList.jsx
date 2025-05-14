
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Edit, Trash2, Eye, Package, DollarSign, Barcode } from 'lucide-react';
    import { motion } from 'framer-motion';

    const ProductList = ({ products, onEdit, onDelete, onTogglePublish, isLoading }) => {
      if (products.length === 0 && !isLoading) {
        return <p className="text-center text-muted-foreground py-10">No se encontraron productos.</p>;
      }

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <TableCell>
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/64'}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-md shadow-sm"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/64'}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="text-sm text-foreground">{product.name}</div>
                    {product.barcode && <div className="text-xs text-muted-foreground flex items-center"><Barcode className="h-3 w-3 mr-1"/>{product.barcode}</div>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-right text-sm">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center text-sm">{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_published ? 'success' : 'outline'} className="cursor-pointer" onClick={() => onTogglePublish(product)}>
                      {product.is_published ? 'Publicado' : 'Borrador'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(product)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                     <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </a>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      );
    };

    export default ProductList;
  