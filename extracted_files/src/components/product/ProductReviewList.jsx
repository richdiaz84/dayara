
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Star } from 'lucide-react';
    import { format, parseISO } from 'date-fns';
    import { es } from 'date-fns/locale';

    const ProductReviewList = ({ reviews }) => {
      if (!reviews || reviews.length === 0) {
        return null;
      }

      const renderStars = (rating) => (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
      );

      return (
        <div className="space-y-6 mt-6">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-card/80 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.user_name}&backgroundColor=FFD700,FFC300,FFB300,FFA000`} alt={review.user_name} />
                    <AvatarFallback>{review.user_name ? review.user_name.substring(0, 2).toUpperCase() : 'AN'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-md font-semibold">{review.user_name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(review.created_at), "dd 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  {review.title && <h4 className="ml-3 text-md font-semibold text-foreground">{review.title}</h4>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    };

    export default ProductReviewList;
  