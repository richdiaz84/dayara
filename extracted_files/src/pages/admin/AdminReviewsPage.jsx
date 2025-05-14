
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { CheckCircle, XCircle, MessageSquare, Star, Loader2, AlertTriangle, Filter, Trash2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';
    import { motion } from 'framer-motion';
    import { Link } from 'react-router-dom';

    const AdminReviewsPage = () => {
      const { toast } = useToast();
      const [reviews, setReviews] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [filter, setFilter] = useState('all'); 

      const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
          let query = supabase
            .from('product_reviews')
            .select(`
              id,
              created_at,
              rating,
              comment,
              title,
              is_approved,
              products (id, name),
              profiles:user_id (email, raw_user_meta_data)
            `)
            .order('created_at', { ascending: false });

          if (filter === 'pending') {
            query = query.is('is_approved', null); 
          } else if (filter === 'approved') {
            query = query.eq('is_approved', true);
          }
          

          const { data, error: dbError } = await query;
          if (dbError) throw dbError;
          
          setReviews(data.map(r => ({
            ...r,
            user_name: r.profiles?.raw_user_meta_data?.full_name || r.profiles?.email || 'Usuario Desconocido'
          })) || []);

        } catch (err) {
          console.error("Error fetching reviews:", err);
          setError(err.message || "No se pudieron cargar las reseñas.");
        } finally {
          setLoading(false);
        }
      }, [filter]);

      useEffect(() => {
        fetchReviews();
      }, [fetchReviews]);

      const handleApprove = async (reviewId) => {
        try {
          const { error } = await supabase
            .from('product_reviews')
            .update({ is_approved: true, updated_at: new Date().toISOString() })
            .eq('id', reviewId);
          if (error) throw error;
          toast({ title: "Reseña Aprobada", description: "La reseña ahora es visible." });
          fetchReviews();
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message });
        }
      };

      const handleUnapprove = async (reviewId) => { 
        try {
          const { error } = await supabase
            .from('product_reviews')
            .update({ is_approved: false, updated_at: new Date().toISOString() }) 
            .eq('id', reviewId);
          if (error) throw error;
          toast({ title: "Reseña Desaprobada", description: "La reseña ya no será visible (o está pendiente)." });
          fetchReviews();
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message });
        }
      };
      
      const handleDelete = async (reviewId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta reseña permanentemente?")) return;
        try {
            const { error } = await supabase.from('product_reviews').delete().eq('id', reviewId);
            if (error) throw error;
            toast({ title: "Reseña Eliminada" });
            fetchReviews();
        } catch (error) {
            toast({ variant: "destructive", title: "Error al eliminar", description: error.message });
        }
      };

      const renderStars = (rating) => {
        return (
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
        );
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
      }

      if (error) {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Error al Cargar Reseñas</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
          </div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <MessageSquare className="mr-3 text-primary"/>Gestión de Reseñas
            </h1>
            <div className="flex space-x-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} size="sm"><Filter className="mr-1.5 h-4 w-4"/>Todas</Button>
              <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')} size="sm">Pendientes</Button>
              <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')} size="sm">Aprobadas</Button>
            </div>
          </div>

          {reviews.length === 0 ? (
             <Card>
                <CardContent className="p-10 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">
                        No hay reseñas que coincidan con el filtro actual.
                    </p>
                    {filter !== 'all' && (
                        <Button variant="link" onClick={() => setFilter('all')} className="mt-2">Mostrar todas las reseñas</Button>
                    )}
                </CardContent>
             </Card>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Usuario</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-[80px]">Rating</TableHead>
                      <TableHead>Comentario</TableHead>
                      <TableHead className="w-[120px]">Estado</TableHead>
                      <TableHead className="w-[180px] text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map(review => (
                      <TableRow key={review.id}>
                        <TableCell className="text-xs">
                          <p className="font-medium">{review.user_name}</p>
                          <p className="text-muted-foreground">{format(parseISO(review.created_at), "dd MMM yy, HH:mm", { locale: es })}</p>
                        </TableCell>
                        <TableCell className="text-xs">
                           <Link to={`/products/${review.products.id}`} className="hover:underline text-primary font-medium" title={review.products.name}>
                                {review.products.name.length > 30 ? `${review.products.name.substring(0,27)}...` : review.products.name}
                           </Link>
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell className="text-xs">
                          {review.title && <p className="font-semibold">{review.title}</p>}
                          <p className="text-muted-foreground line-clamp-2" title={review.comment}>{review.comment || "Sin comentario."}</p>
                        </TableCell>
                        <TableCell>
                           <Badge variant={review.is_approved === null ? 'warning' : review.is_approved ? 'success' : 'destructive'} className="text-xs capitalize">
                            {review.is_approved === null ? 'Pendiente' : review.is_approved ? 'Aprobada' : 'No Aprobada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          {review.is_approved === null || !review.is_approved ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleApprove(review.id)} title="Aprobar">
                              <CheckCircle className="h-4 w-4"/>
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-600 hover:text-yellow-700" onClick={() => handleUnapprove(review.id)} title="Marcar como Pendiente/No Aprobada">
                              <XCircle className="h-4 w-4"/>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80" onClick={() => handleDelete(review.id)} title="Eliminar">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </motion.div>
      );
    };

    export default AdminReviewsPage;
  