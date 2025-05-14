
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
    import { Button } from "@/components/ui/button";
    import { HelpCircle, ChevronDown } from 'lucide-react';

    const faqs = [
      {
        question: "¿Cuáles son los métodos de pago aceptados?",
        answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencias bancarias. Próximamente integraremos más opciones."
      },
      {
        question: "¿Cuánto tiempo tarda el envío?",
        answer: "El tiempo de envío estándar es de 3-5 días hábiles para pedidos nacionales. Los pedidos internacionales pueden tardar entre 7-15 días. Recibirás un número de seguimiento una vez que tu pedido sea enviado."
      },
      {
        question: "¿Puedo devolver un producto?",
        answer: "Sí, tienes 30 días desde la recepción de tu pedido para solicitar una devolución. El producto debe estar en su estado original y sin usar. Por favor, consulta nuestra Política de Devoluciones completa para más detalles."
      },
      {
        question: "¿Cómo puedo rastrear mi pedido?",
        answer: "Una vez que tu pedido haya sido enviado, recibirás un correo electrónico con un enlace de seguimiento. También puedes encontrar esta información en la sección 'Mis Pedidos' de tu cuenta."
      },
      {
        question: "¿Ofrecen descuentos para profesionales?",
        answer: "Sí, tenemos un programa especial para profesionales del sector. Por favor, contáctanos con tu información profesional para conocer los beneficios y cómo aplicar."
      },
      {
        question: "¿Cómo me suscribo al boletín de noticias?",
        answer: "Puedes suscribirte a nuestro boletín ingresando tu correo electrónico en el campo de suscripción que se encuentra en el pie de página de nuestro sitio web. ¡Recibirás noticias, ofertas exclusivas y tutoriales!"
      }
    ];

    const FAQPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              Preguntas Frecuentes
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas rápidas a tus dudas más comunes. Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-card p-6 rounded-lg shadow-xl">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-border/50 last:border-b-0">
                <AccordionTrigger className="text-left hover:no-underline py-4 text-base sm:text-lg font-medium text-foreground">
                  <span className="flex-1">{faq.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">¿No encontraste tu respuesta?</p>
            <Button asChild variant="link" className="text-primary text-lg">
              <a href="/contact">Contáctanos</a>
            </Button>
          </div>
        </motion.div>
      );
    };

    export default FAQPage;
  