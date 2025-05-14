
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { motion } from 'framer-motion';

    const AdminSettingsPaymentsPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-8 px-4 md:px-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configuración de Pagos</CardTitle>
              <CardDescription>
                Gestiona tus métodos de pago y configuraciones relacionadas. Esta sección está en desarrollo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Aquí podrás conectar y configurar tus pasarelas de pago como PayPal, Stripe,
                  y otras opciones de pago locales.
                </p>
                <div className="p-6 border rounded-lg bg-muted/40">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Próximamente</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Integración con PayPal (configuración de credenciales).</li>
                    <li>Integración con Stripe (configuración de credenciales).</li>
                    <li>Configuración de pagos manuales (transferencia bancaria, etc.).</li>
                    <li>Ajustes de moneda y formatos de precio.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AdminSettingsPaymentsPage;
  