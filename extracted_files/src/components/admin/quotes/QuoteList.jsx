
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Eye, Edit, MessageSquare } from 'lucide-react';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';

    const QuoteList = ({ quotes, onEdit, onView, onSendWhatsApp, isLoading }) => {
      if (isLoading && quotes.length === 0) {
        return <p className="text-center text-muted-foreground py-10">Cargando cotizaciones...</p>;
      }
      if (!isLoading && quotes.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No hay cotizaciones para mostrar.</p>;
      }

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Válida Hasta</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium truncate" style={{maxWidth: '100px'}} title={quote.id}>{quote.id.substring(0,8)}...</TableCell>
                  <TableCell>{quote.users?.full_name || quote.customer_name || quote.users?.email || quote.customer_email || 'N/A'}</TableCell>
                  <TableCell>{quote.sales_agents?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(quote.status)} className="capitalize">{quote.status || 'Desconocido'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${parseFloat(quote.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{quote.valid_until ? format(parseISO(quote.valid_until), 'dd MMM yyyy', { locale: es }) : 'N/A'}</TableCell>
                  <TableCell>{format(parseISO(quote.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onView(quote)} title="Ver Detalles">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(quote)} title="Editar Cotización">
                      <Edit className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onSendWhatsApp(quote)} title="Enviar por WhatsApp">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };

    export default QuoteList;
  