
    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

    const ContactPage = () => {
      const { toast } = useToast();
      const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Form data submitted:", formData);
        toast({
          title: "Mensaje Enviado",
          description: "Gracias por contactarnos. Te responderemos pronto.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-12 md:py-16"
        >
          <div className="text-center mb-12">
            <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
              Ponte en Contacto
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes preguntas, comentarios o necesitas ayuda? Estamos aquí para escucharte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-8 rounded-lg shadow-xl space-y-6"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-background/50"/>
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="bg-background/50"/>
                </div>
                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="bg-background/50"/>
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea name="message" id="message" rows={5} value={formData.message} onChange={handleChange} required className="bg-background/50"/>
                </div>
                <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-card p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-foreground mb-4">Información de Contacto</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="flex items-center"><MapPin className="h-5 w-5 mr-3 text-primary" /> Calle Falsa 123, Ciudad, País</p>
                  <p className="flex items-center"><Phone className="h-5 w-5 mr-3 text-primary" /> +1 (234) 567-890</p>
                  <p className="flex items-center"><Mail className="h-5 w-5 mr-3 text-primary" /> contacto@tutiendaonline.com</p>
                </div>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-foreground mb-4">Horario de Atención</h3>
                <p className="text-muted-foreground">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Sábados: 10:00 AM - 2:00 PM</p>
                <p className="text-muted-foreground">Domingos: Cerrado</p>
              </div>
              {/* You can add a map embed here if desired */}
            </motion.div>
          </div>
        </motion.div>
      );
    };

    export default ContactPage;
  