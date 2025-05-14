
    import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { PlusCircle, Users, Package, BarChart3, Settings, MessageSquare as MessageSquareQuote, Star } from 'lucide-react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';

    const QuickActions = () => {
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      const actions = [
        { label: "Nuevo Producto", icon: <Package className="h-5 w-5 mr-2" />, path: "/admin/products?new=true", color: "bg-green-500 hover:bg-green-600" },
        { label: "Ver Pedidos", icon: <BarChart3 className="h-5 w-5 mr-2" />, path: "/admin/orders", color: "bg-blue-500 hover:bg-blue-600" },
        { label: "Gestionar Usuarios", icon: <Users className="h-5 w-5 mr-2" />, path: "/admin/users", color: "bg-indigo-500 hover:bg-indigo-600" },
        { label: "Ver Cotizaciones", icon: <MessageSquareQuote className="h-5 w-5 mr-2" />, path: "/admin/quotes", color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
        { label: "Moderar Reseñas", icon: <Star className="h-5 w-5 mr-2" />, path: "/admin/reviews", color: "bg-purple-500 hover:bg-purple-600" },
      ];

      return (
        <motion.div variants={cardVariants}>
          <Card className="bg-card/70 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accesos directos a tareas comunes.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {actions.map((action, index) => (
                <motion.div key={index} variants={cardVariants} custom={index}>
                  <Button asChild className={`w-full justify-start text-sm py-6 ${action.color}`}>
                    <Link to={action.path}>
                      {action.icon}
                      {action.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default QuickActions;
  