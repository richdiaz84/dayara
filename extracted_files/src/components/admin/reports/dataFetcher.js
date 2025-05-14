
    import { supabase } from '@/lib/supabaseClient';
    import { formatDateForSupabase, formatDateForDisplay } from './reportUtils';
    import { parseISO } from 'date-fns';


    export const fetchSalesSummaryData = async (dateRange) => {
      const { data, error } = await supabase.from('orders').select('total, created_at, id')
        .gte('created_at', formatDateForSupabase(dateRange.from))
        .lte('created_at', formatDateForSupabase(new Date(new Date(dateRange.to).setHours(23,59,59,999))))
        .in('payment_status', ['paid', 'completed']).order('created_at', { ascending: false });
      if (error) throw error;
      const totalRevenue = data.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const numberOfOrders = data.length;
      const averageOrderValue = numberOfOrders > 0 ? totalRevenue / numberOfOrders : 0;
      return { type: "salesSummary", totalRevenue, numberOfOrders, averageOrderValue, orders: data };
    };

    export const fetchSalesByProductData = async (dateRange) => {
      const { data: orderItems, error } = await supabase.from('order_items')
        .select(`quantity, price_at_purchase, subtotal, product_id, product_name, orders!inner ( created_at, payment_status )`)
        .gte('orders.created_at', formatDateForSupabase(dateRange.from))
        .lte('orders.created_at', formatDateForSupabase(new Date(new Date(dateRange.to).setHours(23,59,59,999))))
        .in('orders.payment_status', ['paid', 'completed']);
      if (error) throw error;
      const productSales = orderItems.reduce((acc, item) => {
        const productId = item.product_id;
        if (!acc[productId]) acc[productId] = { id: item.product_id, name: item.product_name || 'Producto Desconocido', quantitySold: 0, totalRevenue: 0 };
        acc[productId].quantitySold += item.quantity;
        acc[productId].totalRevenue += parseFloat(item.subtotal || 0);
        return acc;
      }, {});
      return { type: "salesByProduct", products: Object.values(productSales).sort((a,b) => b.totalRevenue - a.totalRevenue) };
    };

    export const fetchCustomerActivityData = async (dateRange) => {
      const { data: orders, error } = await supabase.from('orders')
        .select('user_id, customer_name, customer_email, total, created_at, id')
        .gte('created_at', formatDateForSupabase(dateRange.from))
        .lte('created_at', formatDateForSupabase(new Date(new Date(dateRange.to).setHours(23,59,59,999))))
        .in('payment_status', ['paid', 'completed']).order('created_at', { ascending: false });
      if (error) throw error;
      const customerData = orders.reduce((acc, order) => {
        const customerIdentifier = order.user_id || order.customer_email;
        if (!customerIdentifier) return acc;
        if (!acc[customerIdentifier]) acc[customerIdentifier] = { identifier: customerIdentifier, name: order.customer_name || 'Cliente Anónimo', email: order.customer_email || 'N/A', userId: order.user_id, totalSpent: 0, orderCount: 0, lastOrderDate: null, firstOrderDate: null };
        acc[customerIdentifier].totalSpent += parseFloat(order.total || 0);
        acc[customerIdentifier].orderCount += 1;
        const orderDateValue = order.created_at ? parseISO(order.created_at) : null;
        if (orderDateValue) {
          if (!acc[customerIdentifier].lastOrderDate || orderDateValue > acc[customerIdentifier].lastOrderDate) acc[customerIdentifier].lastOrderDate = orderDateValue;
          if (!acc[customerIdentifier].firstOrderDate || orderDateValue < acc[customerIdentifier].firstOrderDate) acc[customerIdentifier].firstOrderDate = orderDateValue;
        }
        return acc;
      }, {});
      return { type: "customerActivity", customers: Object.values(customerData).sort((a,b) => b.totalSpent - a.totalSpent) };
    };

    export const fetchCurrentStockData = async () => {
      const { data, error } = await supabase.from('products').select('id, name, stock, category').order('name', { ascending: true });
      if (error) throw error;
      return { type: "currentStock", products: data };
    };

    export const fetchLowStockProductsData = async (lowStockThreshold) => {
      const { data, error } = await supabase.from('products').select('id, name, stock, category').lte('stock', lowStockThreshold).order('stock', { ascending: true });
      if (error) throw error;
      return { type: "lowStock", products: data };
    };
  