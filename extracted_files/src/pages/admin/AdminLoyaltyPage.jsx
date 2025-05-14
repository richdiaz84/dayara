
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2, PlusCircle, Edit, Trash2, Star, Tag, Award } from 'lucide-react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
    import { motion } from 'framer-motion';

    const AdminLoyaltyPage = () => {
      const [tiers, setTiers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [currentTier, setCurrentTier] = useState(null); 
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const { toast } = useToast();

      const fetchTiers = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('loyalty_tiers')
            .select('*')
            .order('min_points', { ascending: true });
          if (error) throw error;
          setTiers(data || []);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los niveles de lealtad." });
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchTiers();
      }, []);

      const handleEdit = (tier) => {
        setCurrentTier({...tier, benefits: tier.benefits ? tier.benefits.join(', ') : ''});
        setIsDialogOpen(true);
      };

      const handleAddNew = () => {
        setCurrentTier({ name: '', min_points: 0, discount_percentage: 0, benefits: '' });
        setIsDialogOpen(true);
      };
      
      const handleDelete = async (tierId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este nivel? Esta acción no se puede deshacer.")) return;
        setIsSubmitting(true);
        try {
          // Check if any user is currently assigned to this tier
          const { data: usersInTier, error: usersError } = await supabase
            .from('loyalty_points')
            .select('id')
            .eq('current_tier_id', tierId)
            .limit(1);

          if (usersError) throw usersError;

          if (usersInTier && usersInTier.length > 0) {
            toast({ variant: "destructive", title: "Error al Eliminar", description: "No se puede eliminar el nivel porque hay usuarios asignados. Reasigna los usuarios a otro nivel primero." });
            setIsSubmitting(false);
            return;
          }

          const { error } = await supabase.from('loyalty_tiers').delete().eq('id', tierId);
          if (error) throw error;
          toast({ title: "Éxito", description: "Nivel de lealtad eliminado." });
          fetchTiers();
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message || "No se pudo eliminar el nivel." });
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentTier || !currentTier.name) {
          toast({variant: "destructive", title: "Error", description: "El nombre del nivel es obligatorio."});
          return;
        }
        setIsSubmitting(true);
        
        const benefitsArray = currentTier.benefits ? currentTier.benefits.split(',').map(b => b.trim()).filter(b => b) : [];
        const tierData = {
          name: currentTier.name,
          min_points: parseInt(currentTier.min_points, 10) || 0,
          discount_percentage: parseFloat(currentTier.discount_percentage) || 0,
          benefits: benefitsArray,
        };

        try {
          let response;
          if (currentTier.id) { // Update
            response = await supabase.from('loyalty_tiers').update(tierData).eq('id', currentTier.id).select();
          } else { // Create
            response = await supabase.from('loyalty_tiers').insert(tierData).select();
          }
          const { error } = response;
          if (error) throw error;
          toast({ title: "Éxito", description: `Nivel de lealtad ${currentTier.id ? 'actualizado' : 'creado'}.` });
          setIsDialogOpen(false);
          setCurrentTier(null);
          fetchTiers();
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message || "No se pudo guardar el nivel." });
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTier(prev => ({ ...prev, [name]: value }));
      };

      if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
      }

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestión de Niveles de Lealtad</h1>
            <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-5 w-5" /> Añadir Nivel</Button>
          </div>

          {tiers.length === 0 && !loading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay niveles de lealtad configurados.</p>
                <p className="text-sm text-muted-foreground">Crea el primer nivel para empezar tu programa de lealtad.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map(tier => (
                <motion.div key={tier.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="h-full flex flex-col shadow-lg hover:shadow-primary/20">
                    <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent">
                      <CardTitle className="flex items-center text-xl"><Star className="mr-2 h-5 w-5 text-yellow-400" />{tier.name}</CardTitle>
                      <CardDescription>Puntos Mínimos: {tier.min_points}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow py-4">
                      <p className="flex items-center text-sm mb-1"><Tag className="mr-2 h-4 w-4 text-green-500" />Descuento: {tier.discount_percentage}%</p>
                      <h4 className="font-semibold text-sm mt-3 mb-1">Beneficios:</h4>
                      {tier.benefits && tier.benefits.length > 0 ? (
                        <ul className="list-disc list-inside text-xs space-y-0.5 text-muted-foreground">
                          {tier.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">Sin beneficios específicos.</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(tier)}><Edit className="mr-1 h-4 w-4" /> Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(tier.id)} disabled={isSubmitting}><Trash2 className="mr-1 h-4 w-4" /> Eliminar</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{currentTier?.id ? 'Editar' : 'Añadir'} Nivel de Lealtad</DialogTitle>
                  <DialogDescription>
                    Configura los detalles para este nivel del programa de lealtad.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Nombre del Nivel</Label>
                    <Input id="name" name="name" value={currentTier?.name || ''} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="min_points">Puntos Mínimos Requeridos</Label>
                    <Input id="min_points" name="min_points" type="number" value={currentTier?.min_points || 0} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="discount_percentage">Porcentaje de Descuento (%)</Label>
                    <Input id="discount_percentage" name="discount_percentage" type="number" step="0.01" value={currentTier?.discount_percentage || 0} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="benefits">Beneficios (separados por coma)</Label>
                    <Input id="benefits" name="benefits" value={currentTier?.benefits || ''} onChange={handleChange} placeholder="Ej: Envío gratis, Acceso VIP"/>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Nivel
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      );
    };

    export default AdminLoyaltyPage;
  