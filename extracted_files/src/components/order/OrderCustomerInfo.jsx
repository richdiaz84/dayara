
    import React from 'react';
    import { CalendarDays, UserCircle, Mail } from 'lucide-react';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';

    const OrderCustomerInfo = ({ order }) => {
      if (!order) return null;

      return (
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <UserCircle className="h-4 w-4 mr-2" />
            <span>{order.customer_name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2" />
            <span>{order.customer_email}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>
              Fecha del Pedido: {order.created_at ? format(parseISO(order.created_at), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es }) : 'N/A'}
            </span>
          </div>
           <p className="text-md mt-2">Número de Pedido: <strong className="text-primary">#{order.id ? order.id.substring(0, 8) : 'N/A'}...</strong></p>
        </div>
      );
    };

    export default OrderCustomerInfo;
  