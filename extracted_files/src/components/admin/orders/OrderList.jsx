
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Button } from '@/components/ui/button';
    import { Eye, Edit, Package, CreditCard, Truck, CheckCircle, XCircle, RefreshCw, DollarSign } from 'lucide-react';
    import { format } from 'date-fns';
    import { es } from 'date-fns/locale';

    const OrderList = ({ orders, onEdit, onView, isLoading }) => {
      if (isLoading && orders.length === 0) {
        return <p className="text-center text-muted-foreground py-10">Cargando pedidos...</p>;
      }
      if (!isLoading && orders.length === 0) {
        return <p className="text-center text-muted-foreground py-10">No se encontraron pedidos.</p>;
      }

      const orderStatusOptions = [
        { value: 'pending_payment', label: 'Pendiente de Pago', icon: <CreditCard className="mr-2 h-4 w-4" /> },
        { value: 'processing', label: 'Procesando', icon: <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> },
        { value: 'ready_for_pickup', label: 'Listo para Recoger', icon: <Package className="mr-2 h-4 w-4" /> },
        { value: 'shipped', label: 'Enviado', icon: <Truck className="mr-2 h-4 w-4" /> },
        { value: 'completed', label: 'Completado', icon: <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> },
        { value: 'cancelled', label: 'Cancelado', icon: <XCircle className="mr-2 h-4 w-4 text-red-500" /> },
        { value: 'refunded', label: 'Reembolsado', icon: <DollarSign className="mr-2 h-4 w-4 text-yellow-500" /> },
        { value: 'error_items_failed', label: 'Error Items', icon: <XCircle className="mr-2 h-4 w-4 text-red-700" /> },
      ];

      const paymentStatusOptions = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' },
        { value: 'refunded', label: 'Reembolsado' },
      ];
      
      const getStatusIcon = (status) => {
        const option = orderStatusOptions.find(opt => opt.value === status);
        return option ? React.cloneElement(option.icon, {className: "h-5 w-5"}) : <Package className="h-5 w-5"/>;
      };

      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-xs">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                </TableCell>
                <TableCell>{format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: es })}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{orderStatusOptions.find(opt => opt.value === order.status)?.label || order.status}</span>
                  </span>
                </TableCell>
                <TableCell>
                   <span className={`px-2 py-1 text-xs rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                     {paymentStatusOptions.find(opt => opt.value === order.payment_status)?.label || order.payment_status}
                   </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(order)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(order)}><Edit className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };

    export default OrderList;
  