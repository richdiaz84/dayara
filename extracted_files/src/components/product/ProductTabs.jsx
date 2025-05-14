
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; 
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProductTabs = ({ product }) => {
  const [reviewName, setReviewName] = React.useState('');
  const [reviewText, setReviewText] = React.useState('');
  const [reviewRating, setReviewRating] = React.useState(0);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Placeholder for review submission logic
    alert(`Reseña enviada: ${reviewName}, ${reviewRating} estrellas, "${reviewText}" (Funcionalidad pendiente)`);
    setReviewName('');
    setReviewText('');
    setReviewRating(0);
  };

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-muted">
        <TabsTrigger value="description" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md">Descripción</TabsTrigger>
        <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md">Reseñas ({product.reviews})</TabsTrigger>
        <TabsTrigger value="shipping" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md hidden md:inline-flex">Envío</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none text-muted-foreground">
        <p>{product.description}</p>
        <h4 className="font-semibold text-foreground mt-4">Características:</h4>
        <ul className="list-disc list-inside">
          {product.tags.map(tag => <li key={tag} className="capitalize">{tag}</li>)}
          <li>Categoría: {product.category}</li>
        </ul>
      </TabsContent>
      <TabsContent value="reviews" className="mt-4 text-muted-foreground">
        <h3 className="text-xl font-semibold text-foreground mb-4">Reseñas de Clientes</h3>
        {/* Placeholder for existing reviews */}
        <div className="space-y-4 mb-6">
          <div className="border p-4 rounded-md bg-card">
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
              <span className="ml-2 font-semibold text-foreground">Excelente producto</span>
            </div>
            <p className="text-sm">"Me encantó, los colores son vibrantes y dura mucho." - Ana P.</p>
            <p className="text-xs text-muted-foreground mt-1">Hace 2 días</p>
          </div>
          <div className="border p-4 rounded-md bg-card">
            <div className="flex items-center mb-1">
              {[...Array(4)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}
              {[...Array(1)].map((_, i) => <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)}
              <span className="ml-2 font-semibold text-foreground">Muy bueno</span>
            </div>
            <p className="text-sm">"Buena calidad, aunque esperaba un poco más de pigmentación en un color." - Laura G.</p>
            <p className="text-xs text-muted-foreground mt-1">Hace 1 semana</p>
          </div>
        </div>
        
        <form onSubmit={handleReviewSubmit} className="space-y-4 p-4 border rounded-md bg-card">
          <h4 className="text-lg font-semibold text-foreground">Escribe tu reseña</h4>
          <div>
            <Label htmlFor="reviewerName" className="text-foreground">Tu Nombre</Label>
            <Input id="reviewerName" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Ej: María S." className="bg-background mt-1" required />
          </div>
          <div>
            <Label className="text-foreground">Calificación</Label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer transition-colors ${reviewRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="reviewText" className="text-foreground">Tu Reseña</Label>
            <Textarea id="reviewText" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Comparte tu experiencia con este producto..." className="bg-background mt-1" rows={4} required />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90">Enviar Reseña</Button>
        </form>
      </TabsContent>
      <TabsContent value="shipping" className="mt-4 text-muted-foreground prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
        <h4 className="font-semibold text-foreground">Información de Envío</h4>
        <p>Detalles sobre nuestras políticas de envío y tiempos de entrega.</p>
        <ul className="list-disc list-inside mt-2">
          <li>Envío estándar: 3-5 días hábiles. Costo: $5.00 (Gratis en pedidos superiores a $50).</li>
          <li>Envío express: 1-2 días hábiles. Costo: $15.00.</li>
          <li>Envíos a toda Guatemala.</li>
          <li>Recibirás un número de seguimiento una vez que tu pedido sea enviado.</li>
        </ul>
        <h4 className="font-semibold text-foreground mt-4">Política de Devoluciones</h4>
        <p>Queremos que estés completamente satisfecha con tu compra.</p>
        <ul className="list-disc list-inside mt-2">
          <li>Devoluciones aceptadas dentro de los 30 días posteriores a la recepción del pedido.</li>
          <li>El producto debe estar sin usar y en su empaque original.</li>
          <li>Contacta a nuestro servicio al cliente para iniciar el proceso de devolución.</li>
        </ul>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
