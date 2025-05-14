
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
    import { Edit, Trash2, ExternalLink, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { format } from 'date-fns';

    const BannerList = ({ banners, onEdit, onDelete, isLoading }) => {
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd MMM yyyy');
      };

      if (isLoading && banners.length === 0) {
         return <div className="flex justify-center items-center h-64"><p>Cargando banners...</p></div>;
      }
      if (!isLoading && banners.length === 0) {
        return <p className="text-center text-muted-foreground mt-10">No hay banners. ¡Añade el primero!</p>;
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {banners.map((banner) => (
              <motion.div
                key={banner.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden h-full flex flex-col bg-card shadow-lg hover:shadow-primary/20">
                  <CardHeader className="p-0 relative">
                    <img  src={banner.image_url} alt={banner.title} className="w-full h-48 object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Error+Imagen'} />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${banner.active ? 'bg-green-500' : 'bg-red-500'}`}>
                      {banner.active ? <CheckCircle className="inline mr-1 h-3 w-3"/> : <XCircle className="inline mr-1 h-3 w-3"/>}
                      {banner.active ? 'Activo' : 'Inactivo'}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{banner.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 truncate" title={banner.description}>{banner.description || 'Sin descripción'}</p>
                    {banner.link_url && (
                      <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" /> {banner.link_url}
                      </a>
                    )}
                    <div className="text-xs text-muted-foreground mt-2 space-y-1">
                      {banner.start_date && <div><CalendarDays className="inline h-3 w-3 mr-1"/> Inicio: {formatDate(banner.start_date)}</div>}
                      {banner.end_date && <div><CalendarDays className="inline h-3 w-3 mr-1"/> Fin: {formatDate(banner.end_date)}</div>}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t border-border flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(banner)}><Edit className="h-4 w-4 mr-1"/> Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(banner)}><Trash2 className="h-4 w-4 mr-1"/> Eliminar</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      );
    };

    export default BannerList;
  