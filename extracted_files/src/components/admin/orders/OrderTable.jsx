
    import React from 'react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { Badge } from '@/components/ui/badge';
    import { Button } from '@/components/ui/button';
    import { Eye, Edit2, MoreHorizontal, ArrowUpDown, Trash2 } from 'lucide-react';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { formatDateForDisplay } from '@/components/admin/reports/reportUtils';

    const OrderTable = ({ orders, onSort, sortConfig, onOpenViewModal, onOpenEditModal, onOpenDeleteDialog }) => {
      
      const getStatusBadgeVariant = (status) => {
        switch (status?.toLowerCase()) {
          case 'pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
          case 'processing':
          case 'preparing_shipment': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
          case 'shipped': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
          case 'completed':
          case 'paid': return 'bg-green-500/20 text-green-700 border-green-500/30';
          case 'cancelled':
          case 'failed': return 'bg-red-500/20 text-red-700 border-red-500/30';
          case 'refunded': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
          default: return 'bg-gray-300/20 text-gray-600 border-gray-400/30';
        }
      };

      const SortableHeader = ({ columnKey, title }) => (
        <TableHead onClick={() => onSort(columnKey)} className="cursor-pointer hover:bg-muted/50">
          <div className="flex items-center gap-1">
            {title}
            {sortConfig.key === columnKey && (sortConfig.direction === 'ascending' ? <ArrowUpDown className="h-4 w-4 opacity-50" /> : <ArrowUpDown className="h-4 w-4 opacity-50" />)}
          </div>
        </TableHead>
      );
      
      return (
        <div className="overflow-x-auto bg-card border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader columnKey="id" title="ID Pedido" />
                <SortableHeader columnKey="customer_name" title="Cliente" />
                <SortableHeader columnKey="created_at" title="Fecha" />
                <SortableHeader columnKey="total" title="Total" />
                <TableHead>Estado Pedido</TableHead>
                <TableHead>Estado Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow><TableCell colSpan="7" className="text-center h-24 text-muted-foreground">No se encontraron pedidos.</TableCell></TableRow>
              ) : (
                orders.map(order => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-primary hover:underline cursor-pointer" onClick={() => onOpenViewModal(order)}>{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.customer_name || order.customer_email || 'N/A'}</TableCell>
                    <TableCell>{formatDateForDisplay(order.created_at)}</TableCell>
                    <TableCell>${parseFloat(order.total || 0).toFixed(2)}</TableCell>
                    <TableCell><Badge variant="outline" className={getStatusBadgeVariant(order.status)}>{order.status || 'N/A'}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={getStatusBadgeVariant(order.payment_status)}>{order.payment_status || 'N/A'}</Badge></TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onOpenViewModal(order)}>
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onOpenEditModal(order)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Editar Pedido
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => onOpenDeleteDialog(order)} className="text-red-600 hover:!text-red-600 hover:!bg-red-500/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      );
    };

    export default OrderTable;
  