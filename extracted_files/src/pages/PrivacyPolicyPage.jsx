
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Shield, FileText, UserCheck } from 'lucide-react';

    const PrivacyPolicyPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              Política de Privacidad
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Aquí detallamos cómo recopilamos, usamos y protegemos tu información.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 bg-card p-8 rounded-lg shadow-xl text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-primary" /> Introducción
              </h2>
              <p>
                Bienvenido a [TuTiendaOnline]. Nos comprometemos a proteger la privacidad de nuestros visitantes y clientes. Esta Política de Privacidad explica qué información recopilamos, cómo la usamos y las opciones que tienes con respecto a tu información personal.
              </p>
              <p className="mt-2">
                Esta política se aplica a la información que recopilamos a través de nuestro sitio web, aplicaciones móviles y otros servicios en línea (colectivamente, nuestros "Servicios").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3 flex items-center">
                <UserCheck className="h-6 w-6 mr-3 text-primary" /> Información que Recopilamos
              </h2>
              <p>Recopilamos varios tipos de información, incluyendo:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong>Información que nos proporcionas directamente:</strong> Esto incluye información que ingresas al crear una cuenta, realizar un pedido, suscribirte a nuestro boletín o contactarnos. Por ejemplo, nombre, dirección de correo electrónico, dirección postal, número de teléfono e información de pago.
                </li>
                <li>
                  <strong>Información recopilada automáticamente:</strong> Cuando utilizas nuestros Servicios, podemos recopilar automáticamente cierta información sobre tu dispositivo y tu uso de los Servicios. Esto puede incluir tu dirección IP, tipo de navegador, sistema operativo, páginas de referencia/salida, fechas/horas de visita y datos de flujo de clics.
                </li>
                <li>
                  <strong>Cookies y Tecnologías Similares:</strong> Usamos cookies y tecnologías de seguimiento similares para recopilar y rastrear información y para mejorar y analizar nuestro Servicio.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Cómo Usamos Tu Información</h2>
              <p>Usamos la información que recopilamos para diversos fines, tales como:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Proveer, operar y mantener nuestros Servicios.</li>
                <li>Procesar tus transacciones y gestionar tus pedidos.</li>
                <li>Mejorar, personalizar y expandir nuestros Servicios.</li>
                <li>Entender y analizar cómo utilizas nuestros Servicios.</li>
                <li>Desarrollar nuevos productos, servicios, características y funcionalidades.</li>
                <li>Comunicarnos contigo, ya sea directamente o a través de uno de nuestros socios, incluso para servicio al cliente, para proporcionarte actualizaciones y otra información relacionada con el Servicio, y con fines de marketing y promoción.</li>
                <li>Enviarte correos electrónicos.</li>
                <li>Encontrar y prevenir el fraude.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Compartir Tu Información</h2>
              <p>
                No vendemos tu información personal. Podemos compartir tu información en circunstancias limitadas, como con proveedores de servicios que nos ayudan a operar nuestro negocio (por ejemplo, procesadores de pago, empresas de envío), cuando sea legalmente requerido, o con tu consentimiento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Seguridad de Tus Datos</h2>
              <p>
                La seguridad de tus datos es importante para nosotros, pero recuerda que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger tu Información Personal, no podemos garantizar su seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Tus Derechos de Privacidad</h2>
              <p>
                Dependiendo de tu ubicación, puedes tener ciertos derechos con respecto a tu información personal, como el derecho a acceder, corregir o eliminar tus datos. Para ejercer estos derechos, por favor contáctanos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Cambios a Esta Política de Privacidad</h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Te recomendamos revisar esta Política de Privacidad periódicamente para cualquier cambio.
              </p>
              <p className="mt-2">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contáctanos</h2>
              <p>
                Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos en: <a href="mailto:privacidad@tutiendaonline.com" className="text-primary underline hover:text-primary/80">privacidad@tutiendaonline.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      );
    };

    export default PrivacyPolicyPage;
  