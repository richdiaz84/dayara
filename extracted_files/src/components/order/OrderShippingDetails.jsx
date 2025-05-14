
    import React from 'react';
    import { Package } from 'lucide-react';

    const OrderShippingDetails = ({ street, city, state, zip, country, phone }) => {
      if (!street || !city || !zip || !country) {
        return <p className="text-muted-foreground">No hay información de envío disponible.</p>;
      }

      return (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Dirección de Envío
          </h3>
          <address className="not-italic text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            {street}<br />
            {city}, {state || ''} {zip}<br />
            {country}
            {phone && (<><br/>Tel: {phone}</>)}
          </address>
        </div>
      );
    };

    export default OrderShippingDetails;
  