
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Loader2, Filter, Search } from 'lucide-react';
    import { format, parseISO, addDays } from 'date-fns';
    import { es } from 'date-fns/locale';
    import { motion } from 'framer-motion';
    import QuoteList from '@/components/admin/quotes/QuoteList';
    import QuoteViewModal from '@/components/admin/quotes/QuoteViewModal';
    import QuoteEditModal from '@/components/admin/quotes/QuoteEditModal';

    const AdminQuotesPage = () => {
      const [quotes, setQuotes] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedQuote, setSelectedQuote] = useState(null);
      const [isViewModalOpen, setIsViewModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [salesAgents, setSalesAgents] = useState([]);
      const [editFormData, setEditFormData] = useState({ status: '', sales_agent_id: '', valid_until: '' });
      const { toast } = useToast();

      const fetchSalesAgents = useCallback(async () => {
        try {
          const { data, error } = await supabase.from('sales_agents').select('id, name');
          if (error) throw error;
          setSalesAgents(data || []);
        } catch (error) {
          console.error('Error fetching sales agents:', error);
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los agentes de ventas." });
        }
      }, [toast]);

      const fetchQuotes = useCallback(async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('quotes')
            .select(`id, user_id, status, total, valid_until, created_at, customer_name, customer_email, customer_phone, notes, quote_items ( id, product_name, quantity, price ), users:user_id ( email, raw_user_meta_data->>'full_name' ), sales_agents:sales_agent_id ( id, name )`)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setQuotes(data || []);
        } catch (error) {
          console.error('Error fetching quotes:', error);
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las cotizaciones." });
        } finally { setLoading(false); }
      }, [toast]);

      useEffect(() => {
        fetchQuotes();
        fetchSalesAgents();
      }, [fetchQuotes, fetchSalesAgents]);

      const handleViewQuote = (quote) => { setSelectedQuote(quote); setIsViewModalOpen(true); };
      const handleOpenEditModal = (quote) => {
        setSelectedQuote(quote);
        setEditFormData({
          status: quote.status || 'pending',
          sales_agent_id: quote.sales_agents?.id || '',
          valid_until: quote.valid_until ? format(parseISO(quote.valid_until), 'yyyy-MM-dd') : format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        });
        setIsEditModalOpen(true);
      };
      
      const handleUpdateQuote = async (e) => {
        e.preventDefault();
        if (!selectedQuote) return;
        setLoading(true);
        try {
          const updateData = {
            status: editFormData.status,
            sales_agent_id: editFormData.sales_agent_id || null,
            valid_until: editFormData.valid_until ? new Date(editFormData.valid_until).toISOString() : null,
          };
          const { data, error } = await supabase.from('quotes').update(updateData).eq('id', selectedQuote.id).select().single();
          if (error) throw error;
          toast({ title: "Cotización Actualizada", description: `La cotización ${data.id.substring(0,8)}... ha sido actualizada.` });
          fetchQuotes(); setIsEditModalOpen(false); setSelectedQuote(null);
        } catch (error) {
          console.error('Error updating quote:', error);
          toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar la cotización." });
        } finally { setLoading(false); }
      };
      
      const handleSendWhatsApp = (quote) => {
        const clientName = quote.users?.full_name || quote.customer_name || 'Cliente';
        const quoteIdShort = quote.id.substring(0,8);
        const quoteLinkPlaceholder = `detalles de la cotización ID ${quoteIdShort}`;
        let message = `Hola ${clientName},\n\nAquí tienes los ${quoteLinkPlaceholder} que solicitaste:\n\n`;
        quote.quote_items.forEach(item => { message += `- ${item.product_name} (x${item.quantity}): ${(item.price * item.quantity).toFixed(2)}\n`; });
        message += `\nTotal: ${parseFloat(quote.total || 0).toFixed(2)}\n`;
        if (quote.valid_until) message += `Válida hasta: ${format(parseISO(quote.valid_until), 'dd MMM yyyy', { locale: es })}\n`;
        message += `\nGracias por tu interés.`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast({ title: "Preparando mensaje de WhatsApp", description: "Se abrirá una nueva pestaña con WhatsApp."});
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestión de Cotizaciones</h1>
            <div className="flex gap-2">
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtrar</Button>
              <Button><Search className="mr-2 h-4 w-4" /> Buscar</Button>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader><CardTitle>Listado de Cotizaciones</CardTitle><CardDescription>Visualiza y gestiona todas las solicitudes de cotización.</CardDescription></CardHeader>
            <CardContent>
              {loading && !isEditModalOpen && !isViewModalOpen ? (
                <div className="flex justify-center items-center py-10"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
              ) : (
                <QuoteList 
                    quotes={quotes} 
                    onEdit={handleOpenEditModal} 
                    onView={handleViewQuote} 
                    onSendWhatsApp={handleSendWhatsApp}
                    isLoading={loading}
                />
              )}
            </CardContent>
            {quotes.length > 0 && <CardFooter><p className="text-xs text-muted-foreground">Total de cotizaciones: {quotes.length}</p></CardFooter>}
          </Card>

          <QuoteViewModal quote={selectedQuote} isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} />
          <QuoteEditModal 
            quote={selectedQuote} 
            isOpen={isEditModalOpen} 
            onClose={() => { setIsEditModalOpen(false); setSelectedQuote(null); }} 
            onUpdate={handleUpdateQuote}
            salesAgents={salesAgents}
            formData={editFormData}
            setFormData={setEditFormData}
            isLoading={loading}
          />
        </motion.div>
      );
    };

    export default AdminQuotesPage;
  