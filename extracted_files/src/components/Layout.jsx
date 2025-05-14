
    import React, { useState } from 'react';
    import Header from '@/components/Header';
    import Footer from '@/components/Footer';
    import { AnimatePresence, motion } from 'framer-motion';
    import LiveChatWidget from '@/components/LiveChatWidget';
    import WhatsAppButton from '@/components/WhatsAppButton';
    import { Button } from '@/components/ui/button';
    import { MessageCircle } from 'lucide-react';
    import { useLocation } from 'react-router-dom';

    const Layout = ({ children }) => {
      const [isChatOpen, setIsChatOpen] = useState(false);
      const phoneNumber = "5211234567890"; 
      const routeLocation = useLocation();

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 },
      };

      const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.4,
      };

      return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <AnimatePresence mode="wait">
            <motion.main
              key={routeLocation.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex-grow"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
            className="fixed bottom-24 right-6 z-50"
          >
             {!isChatOpen && (
                <Button 
                    onClick={() => setIsChatOpen(true)} 
                    size="icon" 
                    className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    aria-label="Abrir chat de soporte"
                >
                    <MessageCircle className="h-7 w-7" />
                </Button>
            )}
          </motion.div>
          
          <WhatsAppButton phoneNumber={phoneNumber} message="Hola, estoy interesado en sus productos y servicios."/>

          <AnimatePresence>
            {isChatOpen && <LiveChatWidget onClose={() => setIsChatOpen(false)} />}
          </AnimatePresence>
        </div>
      );
    };

    export default Layout;
  