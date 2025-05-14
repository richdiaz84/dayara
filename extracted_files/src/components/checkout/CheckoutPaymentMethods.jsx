
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import PayPalCheckoutButton from '@/components/checkout/PayPalCheckoutButton';
    import { Lock } from 'lucide-react';

    const CheckoutPaymentMethods = ({
      paymentMethod,
      setPaymentMethod,
      orderDetails,
      onPayPalSuccess,
      onPayPalError,
      onPayPalProcessing,
      onSimulatedPayment,
      isSubmitting,
    }) => {
      return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => setPaymentMethod('paypal')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'paypal' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">PayPal</span>
                <img  alt="PayPal Logo" className="h-6" src="https://images.unsplash.com/photo-1596843720750-7de9329da5d7" />
              </div>
              {paymentMethod === 'paypal' && <p className="text-xs text-muted-foreground mt-1">Paga de forma segura con tu cuenta de PayPal.</p>}
            </div>

            <div
              onClick={() => setPaymentMethod('simulated')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'simulated' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">Pago Simulado (Pruebas)</span>
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              {paymentMethod === 'simulated' && <p className="text-xs text-muted-foreground mt-1">Solo para fines de prueba. No se procesará un pago real.</p>}
            </div>

            {paymentMethod === 'paypal' && (
              <div className="mt-4">
                <PayPalCheckoutButton
                  orderDetails={orderDetails}
                  onSuccess={onPayPalSuccess}
                  onError={onPayPalError}
                  onProcessing={onPayPalProcessing}
                />
              </div>
            )}
            {paymentMethod === 'simulated' && (
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3 mt-4"
                onClick={onSimulatedPayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Procesando...' : 'Pagar con Método Simulado'}
              </Button>
            )}
          </CardContent>
        </Card>
      );
    };

    export default CheckoutPaymentMethods;
  