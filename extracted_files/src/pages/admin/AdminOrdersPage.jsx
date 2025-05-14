
    import React, { useState, useEffect, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Loader2, PackageSearch, PlusCircle } from 'lucide-react';
    import { motion } from 'framer-motion';
    import OrderFilters from '@/components/admin/orders/OrderFilters';
    import OrderTable from '@/components/admin/orders/OrderTable';
    import OrderViewModal from '@/components/admin/orders/OrderViewModal';
    import OrderEditModal from '@/components/admin/orders/OrderEditModal';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
    import { getDefaultDateRange } from '@/components/admin/reports/reportUtils';

    const ITEMS_PER_PAGE = 15;

    const AdminOrdersPage = () => {
      const { toast } = useToast();
      const [orders, setOrders] = useState([]);
      const [allUsers, setAllUsers] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      const [selectedOrder, setSelectedOrder] = useState(null);
      const [isViewModalOpen, setIsViewModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [orderToDelete, setOrderToDelete] = useState(null);
      
      const [currentPage, setCurrentPage] = useState(1);
      const [totalOrders, setTotalOrders] = useState(0);

      const [filters, setFilters] = useState({
        searchTerm: '',
        status: 'all',
        paymentStatus: 'all',
        userId: 'all',
        minTotal: '',
        maxTotal: '',
      });
      const [dateRange, setDateRange] = useState(getDefaultDateRange());
      const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });

      const orderStatuses = [
        { value: "pending", label: "Pendiente" },
        { value: "processing", label: "Procesando" },
        { value: "shipped", label: "Enviado" },
        { value: "completed", label: "Completado" },
        { value: "cancelled", label: "Cancelado" },
        { value: "preparing_shipment", label: "Preparando Envío" },
      ];
      const paymentStatuses = [
        { value: "pending", label: "Pendiente" },
        { value: "paid", label: "Pagado" },
        { value: "failed", label: "Fallido" },
        { value: "refunded", label: "Reembolsado" },
      ];
      
      const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
          let query = supabase.from('orders').select('*', { count: 'exact' });

          if (filters.searchTerm) {
            query = query.or(`id.ilike.%${filters.searchTerm}%,customer_name.ilike.%${filters.searchTerm}%,customer_email.ilike.%${filters.searchTerm}%`);
          }
          if (filters.status !== 'all') {
            query = query.eq('status', filters.status);
          }
          if (filters.paymentStatus !== 'all') {
            query = query.eq('payment_status', filters.paymentStatus);
          }
          if (filters.userId !== 'all') {
            query = query.eq('user_id', filters.userId);
          }
          if (filters.minTotal) {
            query = query.gte('total', parseFloat(filters.minTotal));
          }
          if (filters.maxTotal) {
            query = query.lte('total', parseFloat(filters.maxTotal));
          }
          if (dateRange.from) {
            query = query.gte('created_at', dateRange.from.toISOString());
          }
          if (dateRange.to) {
            query = query.lte('created_at', new Date(dateRange.to.setHours(23,59,59,999)).toISOString());
          }

          query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'ascending' });
          
          const from = (currentPage - 1) * ITEMS_PER_PAGE;
          const to = from + ITEMS_PER_PAGE - 1;
          query = query.range(from, to);

          const { data, error: queryError, count } = await query;

          if (queryError) throw queryError;
          setOrders(data || []);
          setTotalOrders(count || 0);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError(err.message);
          toast({ variant: "destructive", title: "Error al Cargar Pedidos", description: err.message });
        } finally {
          setIsLoading(false);
        }
      }, [filters, dateRange, sortConfig, currentPage, toast]);

      const fetchAllUsers = async () => {
        try {
          const { data, error } = await supabase.auth.admin.listUsers();
          if (error) throw error;
          setAllUsers(data.users.filter(u => !u.is_anonymous) || []);
        } catch (err) {
          console.error("Error fetching users:", err);
          toast({ variant: "destructive", title: "Error al Cargar Usuarios", description: err.message });
        }
      };


      useEffect(() => {
        fetchOrders();
        fetchAllUsers();
      }, [fetchOrders]);

      const handleSort = (key) => {
        setSortConfig(prevConfig => ({
          key,
          direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
        }));
        setCurrentPage(1);
      };
      
      const handleResetFilters = () => {
        setFilters({ searchTerm: '', status: 'all', paymentStatus: 'all', userId: 'all', minTotal: '', maxTotal: '' });
        setDateRange(getDefaultDateRange());
        setSortConfig({ key: 'created_at', direction: 'descending' });
        setCurrentPage(1);
      };

      const openViewModal = (order) => { setSelectedOrder(order); setIsViewModalOpen(true); };
      const openEditModal = (order) => { setSelectedOrder(order); setIsEditModalOpen(true); };
      
      const openDeleteDialog = (order) => {
        setOrderToDelete(order);
        setIsDeleteDialogOpen(true);
      };

      const handleDeleteOrder = async () => {
        if (!orderToDelete) return;
        try {
          const { error: deleteError } = await supabase.from('orders').delete().eq('id', orderToDelete.id);
          if (deleteError) throw deleteError;
          toast({ title: "Pedido Eliminado", description: `El pedido #${orderToDelete.id.substring(0,8)} ha sido eliminado.` });
          fetchOrders(); 
        } catch (err) {
          console.error("Error deleting order:", err);
          toast({ variant: "destructive", title: "Error al Eliminar Pedido", description: err.message });
        } finally {
          setIsDeleteDialogOpen(false);
          setOrderToDelete(null);
        }
      };
      
      const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestión de Pedidos</h1>
            <Button onClick={() => toast({ title: "Próximamente", description: "La creación manual de pedidos estará disponible pronto." })}>
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Pedido Manual
            </Button>
          </div>

          <OrderFilters 
            filters={filters} 
            setFilters={setFilters} 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
            onResetFilters={handleResetFilters}
            allUsers={allUsers}
            paymentStatuses={paymentStatuses}
            orderStatuses={orderStatuses}
          />

          {isLoading && !orders.length ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
             <div className="text-center py-10 px-4 bg-destructive/10 border border-destructive rounded-md">
                <PackageSearch className="mx-auto h-12 w-12 text-destructive mb-3"/>
                <h3 className="text-xl font-semibold text-destructive mb-2">Error al cargar pedidos</h3>
                <p className="text-sm text-destructive/80 mb-4">{error}</p>
                <Button onClick={fetchOrders} variant="destructive">Intentar de Nuevo</Button>
            </div>
          ) : (
            <>
              <OrderTable 
                orders={orders} 
                onSort={handleSort} 
                sortConfig={sortConfig}
                onOpenViewModal={openViewModal}
                onOpenEditModal={openEditModal}
                onOpenDeleteDialog={openDeleteDialog}
              />
              {totalOrders > ITEMS_PER_PAGE && (
                <div className="flex justify-between items-center mt-6">
                  <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading}>Anterior</Button>
                  <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages} ({totalOrders} pedidos)</span>
                  <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isLoading}>Siguiente</Button>
                </div>
              )}
               {orders.length === 0 && !isLoading && (
                <div className="text-center py-10 px-4 bg-card border border-border rounded-md">
                    <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-3"/>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron pedidos</h3>
                    <p className="text-sm text-muted-foreground mb-4">Prueba ajustando los filtros o creando nuevos pedidos.</p>
                    <Button onClick={handleResetFilters} variant="outline">Limpiar Filtros</Button>
                </div>
              )}
            </>
          )}

          {isViewModalOpen && selectedOrder && (
            <OrderViewModal 
              isOpen={isViewModalOpen} 
              onClose={() => setIsViewModalOpen(false)} 
              order={selectedOrder}
              onOpenEditModal={openEditModal}
            />
          )}
          {isEditModalOpen && selectedOrder && (
            <OrderEditModal 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
              orderInitialData={selectedOrder} 
              onOrderUpdated={() => { fetchOrders(); setIsEditModalOpen(false); }}
              allUsers={allUsers}
              paymentStatuses={paymentStatuses}
              orderStatuses={orderStatuses}
            />
          )}
           {isDeleteDialogOpen && orderToDelete && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido <span className="font-semibold">#{orderToDelete.id.substring(0,8)}</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">Sí, Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </motion.div>
      );
    };

    export default AdminOrdersPage;
  