
    import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { ExternalLink } from 'lucide-react';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';
    import { Link } from 'react-router-dom';

    const QuoteViewModal = ({ quote, isOpen, onClose }) => {
      if (!quote) return null;

      const getStatusBadgeVariant = (status) => {
        switch (status) {
          case 'pending': return 'warning';
          case 'approved': return 'success';
          case 'rejected': return 'destructive';
          case 'expired': return 'outline';
          case 'converted_to_order': return 'info';
          default: return 'secondary';
        }
      };

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">Detalle de Cotización</DialogTitle>
              <DialogDescription>ID: {quote.id}</DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Información del Cliente</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Nombre:</strong> {quote.users?.full_name || quote.customer_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {quote.users?.email || quote.customer_email || 'N/A'}</p>
                    <p><strong>Teléfono:</strong> {quote.customer_phone || 'N/A'}</p>
                    {quote.user_id && <Link to={`/admin/users?edit=${quote.user_id}`} className="text-primary text-xs hover:underline flex items-center">Ver perfil de usuario <ExternalLink className="h-3 w-3 ml-1"/></Link>}
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Información de la Cotización</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <p><strong>Agente:</strong> {quote.sales_agents?.name || 'N/A'}</p>
                    <p><strong>Estado:</strong> <Badge variant={getStatusBadgeVariant(quote.status)} className="capitalize">{quote.status || 'Desconocido'}</Badge></p>
                    <p><strong>Total:</strong> <span className="font-semibold text-primary">${parseFloat(quote.total || 0).toFixed(2)}</span></p>
                    <p><strong>Válida Hasta:</strong> {quote.valid_until ? format(parseISO(quote.valid_until), 'PPP', { locale: es }) : 'N/A'}</p>
                    <p><strong>Creada:</strong> {format(parseISO(quote.created_at), 'PPPp', { locale: es })}</p>
                    {quote.notes && <p className="mt-2"><strong>Notas Cliente:</strong> <span className="italic">{quote.notes}</span></p>}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="font-semibold text-md mb-2">Artículos Cotizados:</h4>
                {quote.quote_items && quote.quote_items.length > 0 ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-center">Cant.</TableHead>
                          <TableHead className="text-right">Precio Unit.</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quote.quote_items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product_name || 'Producto no especificado'}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">${parseFloat(item.price || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay artículos en esta cotización.</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default QuoteViewModal;
  