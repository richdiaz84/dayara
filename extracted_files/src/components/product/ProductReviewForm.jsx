
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { useToast } from '@/components/ui/use-toast';
    import { Star, Loader2 } from 'lucide-react';

    const ProductReviewForm = ({ productId, userId, onReviewSubmitted }) => {
      const [rating, setRating] = useState(0);
      const [hoverRating, setHoverRating] = useState(0);
      const [title, setTitle] = useState('');
      const [comment, setComment] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
          toast({ variant: "destructive", title: "Calificación Requerida", description: "Por favor, selecciona una calificación." });
          return;
        }
        setIsLoading(true);
        try {
          const { error } = await supabase
            .from('product_reviews')
            .insert({
              product_id: productId,
              user_id: userId,
              rating,
              title,
              comment,
              is_approved: null, // Pending approval
            });
          if (error) throw error;
          
          setRating(0);
          setTitle('');
          setComment('');
          if (onReviewSubmitted) onReviewSubmitted();

        } catch (error) {
          toast({ variant: "destructive", title: "Error al Enviar Reseña", description: error.message });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="mt-8 p-6 border rounded-lg bg-card shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Escribe tu Reseña</h3>
          <div>
            <Label className="block mb-2 text-sm font-medium">Calificación General</Label>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={starValue}
                    className={`h-7 w-7 cursor-pointer transition-colors
                      ${(hoverRating || rating) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'}
                    `}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="reviewTitle" className="text-sm font-medium">Título de tu reseña (opcional)</Label>
            <Input 
              id="reviewTitle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: ¡Excelente producto!" 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="reviewComment" className="text-sm font-medium">Tu Reseña</Label>
            <Textarea 
              id="reviewComment" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="Describe tu experiencia con el producto..." 
              rows={4}
              className="mt-1"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || rating === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar Reseña
          </Button>
        </form>
      );
    };

    export default ProductReviewForm;
  