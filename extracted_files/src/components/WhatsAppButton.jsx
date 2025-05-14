
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { MessageSquare } from 'lucide-react';
    import { motion } from 'framer-motion';

    const WhatsAppButton = ({ phoneNumber, message }) => {
      const defaultMessage = message || "Hola, estoy interesado en sus productos.";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            asChild
            size="icon"
            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white shadow-lg"
            aria-label="Contactar por WhatsApp"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-7 w-7" />
            </a>
          </Button>
        </motion.div>
      );
    };

    export default WhatsAppButton;
  