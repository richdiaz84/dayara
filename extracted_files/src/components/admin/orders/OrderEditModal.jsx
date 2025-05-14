
    import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Loader2, Package, CreditCard, Truck, CheckCircle, XCircle, RefreshCw, DollarSign } from 'lucide-react';

    const OrderEditModal = ({ order, isOpen, onClose, onUpdate, currentOrderStatus, setCurrentOrderStatus, currentPaymentStatus, setCurrentPaymentStatus, isLoading }) => {
      if (!order) return null;

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
        { value: 'pending', label: 'Pendiente' }, { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' }, { value: 'refunded', label: 'Reembolsado' },
      ];

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estado del Pedido: {order.id.substring(0,8)}...</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="orderStatus" className="block text-sm font-medium mb-1">Estado del Pedido</label>
                <Select value={currentOrderStatus} onValueChange={setCurrentOrderStatus}>
                  <SelectTrigger id="orderStatus"><SelectValue placeholder="Seleccionar estado..." /></SelectTrigger>
                  <SelectContent>
                    {orderStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center">{option.icon} {option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium mb-1">Estado del Pago</label>
                <Select value={currentPaymentStatus} onValueChange={setCurrentPaymentStatus}>
                  <SelectTrigger id="paymentStatus"><SelectValue placeholder="Seleccionar estado de pago..." /></SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
              <Button onClick={onUpdate} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar Estado
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default OrderEditModal;
  