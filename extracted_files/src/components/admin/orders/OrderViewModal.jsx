
    import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { format } from 'date-fns';
    import { es } from 'date-fns/locale';

    const OrderViewModal = ({ order, isOpen, onClose }) => {
      if (!order) return null;

      const orderStatusOptions = [
        { value: 'pending_payment', label: 'Pendiente de Pago' }, { value: 'processing', label: 'Procesando' },
        { value: 'ready_for_pickup', label: 'Listo para Recoger' }, { value: 'shipped', label: 'Enviado' },
        { value: 'completed', label: 'Completado' }, { value: 'cancelled', label: 'Cancelado' },
        { value: 'refunded', label: 'Reembolsado' }, { value: 'error_items_failed', label: 'Error Items' },
      ];
      const paymentStatusOptions = [
        { value: 'pending', label: 'Pendiente' }, { value: 'paid', label: 'Pagado' },
        { value: 'failed', label: 'Fallido' }, { value: 'refunded', label: 'Reembolsado' },
      ];

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido: {order.id.substring(0,8)}...</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <p><strong>Cliente:</strong> {order.customer_name} ({order.customer_email})</p>
              <p><strong>Teléfono:</strong> {order.shipping_address_phone || 'N/A'}</p>
              <p><strong>Fecha:</strong> {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm:ss', { locale: es })}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)} (Subtotal: ${order.subtotal.toFixed(2)}, Envío: ${order.shipping_cost.toFixed(2)}, IVA: ${order.tax_amount.toFixed(2)})</p>
              <p><strong>Estado Pedido:</strong> {orderStatusOptions.find(opt => opt.value === order.status)?.label || order.status}</p>
              <p><strong>Estado Pago:</strong> {paymentStatusOptions.find(opt => opt.value === order.payment_status)?.label || order.payment_status}</p>
              <p><strong>Método Pago:</strong> {order.payment_method}</p>
              {order.transaction_id && <p><strong>ID Transacción:</strong> {order.transaction_id}</p>}
              
              <div className="pt-2 border-t">
                <h4 className="font-semibold mb-1">Dirección de Envío:</h4>
                <p>{order.shipping_address_street}, {order.shipping_address_city}, {order.shipping_address_state} {order.shipping_address_zip}, {order.shipping_address_country}</p>
              </div>
              <div className="pt-2 border-t">
                <h4 className="font-semibold mb-1">Dirección de Facturación:</h4>
                <p>{order.billing_address_street}, {order.billing_address_city}, {order.billing_address_state} {order.billing_address_zip}, {order.billing_address_country}</p>
              </div>
              
              {order.notes && <div className="pt-2 border-t"><h4 className="font-semibold mb-1">Notas del Cliente:</h4><p className="whitespace-pre-wrap">{order.notes}</p></div>}

              <div className="pt-2 border-t">
                <h4 className="font-semibold mb-2 mt-2">Artículos del Pedido:</h4>
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-1">
                    <span>{item.product_name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default OrderViewModal;
  