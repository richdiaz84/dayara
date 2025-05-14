
    import React, { useState, useRef, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { X, Send, MessageSquare, Loader2 } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";

    const LiveChatWidget = ({ onClose }) => {
      const [messages, setMessages] = useState([
        { id: 'initial-agent-message', sender: 'agent', text: '¡Hola! ¿Cómo podemos ayudarte hoy?' },
      ]);
      const [inputText, setInputText] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [sessionId, setSessionId] = useState(null);
      const messagesEndRef = useRef(null);
      const { toast } = useToast();

      useEffect(() => {
        setSessionId(crypto.randomUUID());
      }, []);

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(scrollToBottom, [messages]);

      const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputText.trim() === '' || isLoading) return;

        const userMessage = {
          id: crypto.randomUUID(),
          sender: 'user',
          text: inputText.trim(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
          const { data, error } = await supabase.functions.invoke('chat-ai-handler', {
            body: JSON.stringify({ 
              message: userMessage.text,
              sessionId: sessionId,
            }),
          });

          if (error) throw error;

          if (data && data.reply) {
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              sender: 'agent',
              text: data.reply,
            }]);
          } else {
             setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              sender: 'agent',
              text: 'Lo siento, no pude procesar tu solicitud en este momento.',
            }]);
          }
        } catch (error) {
          console.error('Error calling chat-ai-handler:', error);
          toast({
            variant: "destructive",
            title: "Error de Chat",
            description: error.message || "No se pudo conectar con el asistente virtual.",
          });
           setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            sender: 'agent',
            text: 'Hubo un problema al conectar con el asistente. Por favor, intenta más tarde.',
          }]);
        } finally {
          setIsLoading(false);
        }
      };

      const widgetVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
      };

      return (
        <motion.div
          variants={widgetVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-24 right-6 w-80 h-[28rem] bg-card border border-border rounded-lg shadow-2xl flex flex-col overflow-hidden z-50"
        >
          <header className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <h3 className="font-semibold text-lg">Soporte en Vivo</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary/80">
              <X className="h-5 w-5" />
            </Button>
          </header>

          <div className="flex-grow p-3 space-y-3 overflow-y-auto bg-muted/30">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={msg.sender === 'agent' ? `https://avatar.vercel.sh/agent-bot.png` : `https://avatar.vercel.sh/user-chat.png`} />
                    <AvatarFallback>{msg.sender === 'agent' ? 'A' : 'U'}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`px-3 py-2 rounded-xl ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-background border border-border text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length -1]?.sender === 'user' && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[80%]">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://avatar.vercel.sh/agent-bot.png" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="px-3 py-2 rounded-xl bg-background border border-border text-foreground rounded-bl-none">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-grow"
                autoFocus
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!inputText.trim() || isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </motion.div>
      );
    };

    export default LiveChatWidget;
  