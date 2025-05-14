
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Facebook, Instagram, Twitter, Youtube, Send, Loader2, BookOpen } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { motion } from 'framer-motion';

    const Footer = () => {
      const currentYear = new Date().getFullYear();
      const { toast } = useToast();
      const [email, setEmail] = useState('');
      const [isSubscribing, setIsSubscribing] = useState(false);

      const handleSubscription = async (e) => {
        e.preventDefault();
        if (!email) {
          toast({ variant: "destructive", title: "Error", description: "Por favor, ingresa tu correo electrónico."});
          return;
        }
        setIsSubscribing(true);
        try {
          const { error } = await supabase
            .from('email_subscriptions')
            .insert({ email: email, status: 'subscribed' });

          if (error) {
            if (error.code === '23505') { 
              toast({ variant: "warning", title: "Ya Suscrito", description: "Este correo ya está suscrito a nuestro boletín." });
            } else {
              throw error;
            }
          } else {
            toast({ title: "¡Suscripción Exitosa!", description: "Gracias por suscribirte a nuestro boletín." });
            setEmail('');
          }
        } catch (error) {
          console.error("Error subscribing to newsletter:", error);
          toast({ variant: "destructive", title: "Error de Suscripción", description: "No se pudo procesar tu suscripción. Inténtalo de nuevo." });
        } finally {
          setIsSubscribing(false);
        }
      };

      return (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card text-card-foreground border-t mt-auto"
        >
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Dayara</h3>
                <p className="text-sm text-muted-foreground">
                  Descubre productos increíbles y experiencias únicas. Calidad y servicio que nos distinguen.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube size={20} /></a>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-semibold uppercase tracking-wider text-foreground">Navegación</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link></li>
                  <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Productos</Link></li>
                  <li><Link to="/exclusive-content" className="text-muted-foreground hover:text-primary transition-colors">Contenido Exclusivo</Link></li>
                  <li><Link to="/request-quote" className="text-muted-foreground hover:text-primary transition-colors">Solicitar Cotización</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-semibold uppercase tracking-wider text-foreground">Ayuda</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                  <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link></li>
                  <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Políticas de Envío</Link></li>
                  <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidad</Link></li>
                  <li><Link to="/manual" className="text-muted-foreground hover:text-primary transition-colors flex items-center"><BookOpen size={16} className="mr-1.5"/>Manual de Usuario</Link></li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-semibold uppercase tracking-wider text-foreground">Boletín Informativo</h4>
                <p className="text-sm text-muted-foreground">Suscríbete para recibir ofertas especiales y novedades.</p>
                <form onSubmit={handleSubscription} className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    className="bg-background/50 border-border focus:ring-primary" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                  />
                  <Button type="submit" variant="default" size="icon" className="flex-shrink-0" disabled={isSubscribing}>
                    {isSubscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                  </Button>
                </form>
              </div>

            </div>
            <div className="mt-10 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
              <p>&copy; {currentYear} Dayara. Todos los derechos reservados.</p>
              <p className="mt-1">Diseñado con <span className="text-primary">&hearts;</span> por Hostinger Horizons</p>
            </div>
          </div>
        </motion.footer>
      );
    };

    export default Footer;
  