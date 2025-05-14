
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Truck, Clock, Globe, Package } from 'lucide-react';

    const ShippingPolicyPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          <div className="text-center mb-12">
            <Truck className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              Política de Envíos
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Información detallada sobre nuestros procesos, tiempos y costos de envío.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 bg-card p-8 rounded-lg shadow-xl">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-primary" /> Tiempos de Procesamiento
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Todos los pedidos se procesan dentro de 1-2 días hábiles (excluyendo fines de semana y días festivos) después de recibir la confirmación de tu pedido. Recibirás otra notificación cuando tu pedido haya sido enviado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Truck className="h-6 w-6 mr-3 text-primary" /> Tarifas y Tiempos de Envío Nacional
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ofrecemos envío estándar gratuito en pedidos superiores a $50. Para pedidos inferiores a $50, se aplica una tarifa fija de $10.
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Envío Estándar (3-5 días hábiles): $10 (Gratis en pedidos > $50)</li>
                <li>Envío Express (1-2 días hábiles): $25 (Próximamente)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Globe className="h-6 w-6 mr-3 text-primary" /> Envíos Internacionales
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Actualmente realizamos envíos internacionales a países seleccionados. Las tarifas de envío y los tiempos de entrega varían según el destino. Los costos de envío se calcularán y mostrarán en la pantalla de pago.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Tu pedido puede estar sujeto a derechos de importación e impuestos (incluido el IVA), que se aplican una vez que el envío llega a tu país de destino. [TuTiendaOnline] no es responsable de estos cargos si se aplican y son tu responsabilidad como cliente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <Package className="h-6 w-6 mr-3 text-primary" /> Estado del Pedido y Seguimiento
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cuando tu pedido haya sido enviado, recibirás una notificación por correo electrónico de nuestra parte que incluirá un número de seguimiento que puedes usar para verificar su estado. Por favor, espera 48 horas para que la información de seguimiento esté disponible.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Si no has recibido tu pedido dentro de los X días posteriores a recibir tu correo electrónico de confirmación de envío, contáctanos en [email de soporte] con tu nombre y número de pedido, y lo investigaremos por ti.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Devoluciones y Reembolsos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aceptamos devoluciones hasta 30 días después de la entrega, si el artículo no se ha utilizado y está en su estado original. Te reembolsaremos el monto total del pedido menos los costos de envío de la devolución. Consulta nuestra <a href="/privacy" className="text-primary underline hover:text-primary/80">Política de Privacidad y Devoluciones</a> para más detalles.
              </p>
            </section>
          </div>
        </motion.div>
      );
    };

    export default ShippingPolicyPage;
  