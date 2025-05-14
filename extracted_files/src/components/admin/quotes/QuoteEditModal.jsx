
    import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Loader2 } from 'lucide-react';
    import { format } from 'date-fns';

    const QuoteEditModal = ({ quote, isOpen, onClose, onUpdate, salesAgents, formData, setFormData, isLoading }) => {
      if (!quote) return null;

      const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      };

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Editar Cotización</DialogTitle>
              <DialogDescription>ID: {quote.id.substring(0,8)}...</DialogDescription>
            </DialogHeader>
            <form onSubmit={onUpdate} className="space-y-4 py-4">
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="approved">Aprobada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                    <SelectItem value="expired">Expirada</SelectItem>
                    <SelectItem value="converted_to_order">Convertida a Pedido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sales_agent_id">Agente de Ventas</Label>
                <Select value={formData.sales_agent_id} onValueChange={(value) => handleFormChange('sales_agent_id', value)}>
                  <SelectTrigger id="sales_agent_id">
                    <SelectValue placeholder="Asignar agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=""><em>Sin Asignar</em></SelectItem>
                    {salesAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valid_until">Válida Hasta</Label>
                <Input 
                  id="valid_until" 
                  type="date" 
                  value={formData.valid_until} 
                  onChange={(e) => handleFormChange('valid_until', e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar Cotización
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };

    export default QuoteEditModal;
  