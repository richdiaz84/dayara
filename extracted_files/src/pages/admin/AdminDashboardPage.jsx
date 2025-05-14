
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
    import DashboardStats from '@/components/admin/dashboard/DashboardStats';
    import RecentActivityFeed from '@/components/admin/dashboard/RecentActivityFeed';
    import QuickActions from '@/components/admin/dashboard/QuickActions';
    import { LOW_STOCK_THRESHOLD } from '@/components/admin/reports/reportUtils';

    const AdminDashboardPage = () => {
      const { toast } = useToast();
      const [stats, setStats] = useState({});
      const [activities, setActivities] = useState([]);
      const [isLoadingStats, setIsLoadingStats] = useState(true);
      const [isLoadingActivities, setIsLoadingActivities] = useState(true);

      const fetchDashboardData = useCallback(async () => {
        setIsLoadingStats(true);
        setIsLoadingActivities(true);
        try {
          const currentMonthStart = startOfMonth(new Date());
          const currentMonthEnd = endOfMonth(new Date());

          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('total, created_at, user_id')
            .gte('created_at', currentMonthStart.toISOString())
            .lte('created_at', currentMonthEnd.toISOString())
            .in('payment_status', ['paid', 'completed']);
          if (ordersError) throw ordersError;

          const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
          const totalOrders = ordersData.length;
          
          const uniqueUserIds = new Set(ordersData.map(order => order.user_id).filter(id => id));
          const newCustomers = uniqueUserIds.size;


          const { data: productsData, error: productsError, count: totalProductsCount } = await supabase
            .from('products')
            .select('id, stock', { count: 'exact' });
          if (productsError) throw productsError;
          
          const lowStockItems = productsData.filter(p => p.stock <= LOW_STOCK_THRESHOLD).length;


          const { data: quotesData, error: quotesError, count: pendingQuotesCount } = await supabase
            .from('quotes')
            .select('id', { count: 'exact' })
            .eq('status', 'pending');
          if (quotesError) throw quotesError;


          setStats({
            totalRevenue,
            totalOrders,
            newCustomers,
            lowStockItems,
            pendingQuotes: pendingQuotesCount || 0,
            totalProducts: totalProductsCount || 0,
          });
          setIsLoadingStats(false);

          const { data: recentActivitiesData, error: activitiesError } = await supabase
            .rpc('get_recent_activities', { limit_count: 10 });
          if (activitiesError) throw activitiesError;
          
          setActivities(recentActivitiesData || []);
          setIsLoadingActivities(false);

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          toast({ variant: "destructive", title: "Error al cargar datos del dashboard", description: error.message });
          setIsLoadingStats(false);
          setIsLoadingActivities(false);
        }
      }, [toast]);

      useEffect(() => {
        fetchDashboardData();
      }, [fetchDashboardData]);

      const pageVariants = {
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
      };
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };

      return (
        <motion.div 
          initial="initial" animate="in" exit="out" variants={pageVariants}
          className="p-4 md:p-6 space-y-6"
        >
          <motion.h1 
            variants={{hidden: {opacity:0, y:-20}, visible: {opacity:1, y:0}}} 
            initial="hidden" animate="visible"
            className="text-3xl font-bold text-foreground"
          >
            Dashboard Principal
          </motion.h1>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <DashboardStats stats={stats} isLoading={isLoadingStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivityFeed activities={activities} isLoading={isLoadingActivities} />
              </div>
              <div className="lg:col-span-1">
                <QuickActions />
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    export default AdminDashboardPage;
  