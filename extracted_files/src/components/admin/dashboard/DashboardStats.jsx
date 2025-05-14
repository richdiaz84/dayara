
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
    import { DollarSign, Users, ShoppingCart, Package, AlertTriangle, BarChart3 } from 'lucide-react';
    import { motion } from 'framer-motion';

    const StatCard = ({ title, value, icon, description, color, isLoading }) => {
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      return (
        <motion.div variants={cardVariants}>
          <Card className={`bg-card/70 backdrop-blur-md border-l-4 ${color || 'border-primary'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-3/4"></div>
              ) : (
                <div className="text-2xl font-bold text-foreground">{value}</div>
              )}
              {description && !isLoading && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
            </CardContent>
          </Card>
        </motion.div>
      );
    };
    
    const DashboardStats = ({ stats, isLoading }) => {
      const defaultStats = {
        totalRevenue: 0,
        totalOrders: 0,
        newCustomers: 0,
        lowStockItems: 0,
        pendingQuotes: 0,
        totalProducts: 0,
      };
      const displayStats = isLoading ? defaultStats : { ...defaultStats, ...stats };

      return (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="visible"
        >
          <StatCard 
            title="Ingresos Totales (Mes)" 
            value={`$${parseFloat(displayStats.totalRevenue || 0).toFixed(2)}`} 
            icon={<DollarSign className="h-5 w-5 text-green-500" />} 
            color="border-green-500"
            isLoading={isLoading}
          />
          <StatCard 
            title="Pedidos (Mes)" 
            value={displayStats.totalOrders} 
            icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} 
            color="border-blue-500"
            isLoading={isLoading}
          />
          <StatCard 
            title="Nuevos Clientes (Mes)" 
            value={displayStats.newCustomers} 
            icon={<Users className="h-5 w-5 text-indigo-500" />} 
            color="border-indigo-500"
            isLoading={isLoading}
          />
          <StatCard 
            title="Productos Totales" 
            value={displayStats.totalProducts} 
            icon={<Package className="h-5 w-5 text-purple-500" />} 
            color="border-purple-500"
            isLoading={isLoading}
          />
          <StatCard 
            title="Items con Bajo Stock" 
            value={displayStats.lowStockItems} 
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />} 
            color="border-red-500"
            isLoading={isLoading}
          />
           <StatCard 
            title="Cotizaciones Pendientes" 
            value={displayStats.pendingQuotes} 
            icon={<BarChart3 className="h-5 w-5 text-yellow-500" />} 
            color="border-yellow-500"
            isLoading={isLoading}
          />
        </motion.div>
      );
    };

    export default DashboardStats;
  