
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Badge } from '@/components/ui/badge';
    import { formatDistanceToNow } from 'date-fns';
    import { es } from 'date-fns/locale';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { PackagePlus, ShoppingCart, UserPlus, MessageSquare as MessageSquareQuote, Star } from 'lucide-react';

    const ActivityItem = ({ icon, title, description, time, link, index }) => {
      const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { delay: index * 0.05 } }
      };
      return (
        <motion.div variants={itemVariants} className="flex items-start space-x-3 py-3 hover:bg-muted/50 px-2 rounded-md transition-colors">
          <div className="flex-shrink-0 mt-1 text-primary">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {link ? <Link to={link} className="hover:underline">{title}</Link> : title}
            </p>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
          <time className="text-xs text-muted-foreground whitespace-nowrap">{time}</time>
        </motion.div>
      );
    };
    
    const RecentActivityFeed = ({ activities, isLoading }) => {
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      const getActivityIcon = (type) => {
        switch(type) {
          case 'new_order': return <ShoppingCart className="h-5 w-5" />;
          case 'new_user': return <UserPlus className="h-5 w-5" />;
          case 'new_product': return <PackagePlus className="h-5 w-5" />;
          case 'new_quote': return <MessageSquareQuote className="h-5 w-5" />;
          case 'new_review': return <Star className="h-5 w-5" />;
          default: return <ShoppingCart className="h-5 w-5" />;
        }
      };

      const formatActivityTime = (timestamp) => {
        if (!timestamp) return '';
        try {
          return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });
        } catch (e) {
          return 'hace un momento';
        }
      };

      if (isLoading && (!activities || activities.length === 0)) {
        return (
          <motion.div variants={cardVariants}>
            <Card className="bg-card/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Cargando últimas actualizaciones...</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 py-3">
                    <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="h-3 bg-muted/50 rounded animate-pulse w-1/4"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        );
      }

      return (
        <motion.div variants={cardVariants}>
          <Card className="bg-card/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas actualizaciones en tu tienda.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px] pr-3">
                {activities && activities.length > 0 ? (
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" animate="visible">
                    {activities.map((activity, index) => (
                      <ActivityItem
                        key={activity.id}
                        index={index}
                        icon={getActivityIcon(activity.type)}
                        title={activity.title}
                        description={activity.description}
                        time={formatActivityTime(activity.created_at)}
                        link={activity.link}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <PackagePlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No hay actividad reciente para mostrar.</p>
                    <p className="text-xs text-muted-foreground/80">Realiza algunas acciones para verlas aquí.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default RecentActivityFeed;
  