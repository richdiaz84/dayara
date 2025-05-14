
    import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import { CartProvider } from '@/contexts/CartContext';
    import { WishlistProvider } from '@/contexts/WishlistContext';
    import { ComparisonProvider } from '@/contexts/ComparisonContext';
    import { LoyaltyProvider } from '@/contexts/LoyaltyContext';
    import { CurrencyProvider } from '@/contexts/CurrencyContext';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import ProductsPage from '@/pages/ProductsPage';
    import ProductDetailPage from '@/pages/ProductDetailPage';
    import CartPage from '@/pages/CartPage';
    import CheckoutPage from '@/pages/CheckoutPage';
    import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
    import OrderCancelledPage from '@/pages/OrderCancelledPage';
    import WishlistPage from '@/pages/WishlistPage';
    import CompareProductsPage from '@/pages/CompareProductsPage';
    import AuthPage from '@/pages/AuthPage';
    import ExclusiveContentPage from '@/pages/ExclusiveContentPage';
    import AdminLayout from '@/components/admin/AdminLayout';
    import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
    import AdminProductsPage from '@/pages/admin/AdminProductsPage';
    import AdminUsersPage from '@/pages/admin/AdminUsersPage';
    import AdminReportsPage from '@/pages/admin/AdminReportsPage';
    import AdminBannersPage from '@/pages/admin/AdminBannersPage';
    import AdminLoyaltyPage from '@/pages/admin/AdminLoyaltyPage'; 
    import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
    import AdminQuotesPage from '@/pages/admin/AdminQuotesPage';
    import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
    import AdminSettingsShippingPage from '@/pages/admin/AdminSettingsShippingPage';
    import AdminSettingsGeneralPage from '@/pages/admin/AdminSettingsGeneralPage';
    import AdminSettingsPaymentsPage from '@/pages/admin/AdminSettingsPaymentsPage';
    import RequestQuotePage from '@/pages/RequestQuotePage';
    import AgentPOSPage from '@/pages/agent/AgentPOSPage';
    import FAQPage from '@/pages/FAQPage';
    import ContactPage from '@/pages/ContactPage';
    import ShippingPolicyPage from '@/pages/ShippingPolicyPage';
    import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
    import UserManualPage from '@/pages/UserManualPage';
    import { Toaster } from '@/components/ui/toaster';
    import { useToast } from '@/components/ui/use-toast';
    import { ThemeProvider } from '@/contexts/ThemeContext';
    import AccountOrdersPage from '@/pages/AccountOrdersPage';
    import AccountProfilePage from '@/pages/AccountProfilePage';
    import AccountLoyaltyPage from '@/pages/AccountLoyaltyPage';
    import { Button } from '@/components/ui/button';
    import { Loader2 } from 'lucide-react';

    const GlobalLoadingIndicator = () => {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <Loader2 className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary" />
            </div>
        );
    };
    
    const ProtectedRoute = ({ children, allowedRoles }) => {
      const { user, userRole, loading } = useAuth();
      const { toast } = useToast();
      const location = useLocation();

      if (loading) {
        return <GlobalLoadingIndicator />;
      }

      if (!user) {
        return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
      }
      
      if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
         toast({ variant: "destructive", title: "Acceso Denegado", description: "No tienes permiso para acceder a esta página." });
        return <Navigate to="/" replace />; 
      }
      
      return children;
    };
    

    const AdminRoutes = () => (
      <ProtectedRoute allowedRoles={['admin', 'agente']}>
        <AdminLayout>
          <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="banners" element={<AdminBannersPage />} />
            <Route path="loyalty" element={<AdminLoyaltyPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="quotes" element={<AdminQuotesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings/general" element={<AdminSettingsGeneralPage />} />
            <Route path="settings/payments" element={<AdminSettingsPaymentsPage />} />
            <Route path="settings/shipping" element={<AdminSettingsShippingPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminLayout>
      </ProtectedRoute>
    );

    const AccountAreaLayout = ({ children }) => (
        <Layout>
            <div className="container mx-auto py-8 md:py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <h2 className="text-xl font-semibold mb-4 text-foreground">Mi Cuenta</h2>
                        <nav>
                            <ul className="space-y-1">
                                <li><Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Link to="/account/profile">Perfil</Link></Button></li>
                                <li><Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Link to="/account/orders">Mis Pedidos</Link></Button></li>
                                <li><Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Link to="/account/loyalty">Programa de Lealtad</Link></Button></li>
                            </ul>
                        </nav>
                    </aside>
                    <main className="md:col-span-3">
                        {children}
                    </main>
                </div>
            </div>
        </Layout>
    );


    function AppRoutes() {
      const { loading: authLoading } = useAuth();
      
      return (
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            <Route 
              path="/agent/pos" 
              element={
                <ProtectedRoute allowedRoles={['agente', 'admin']}>
                  <Layout>
                    <AgentPOSPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/account/*" 
              element={
                <ProtectedRoute allowedRoles={['cliente', 'admin', 'agente']}>
                  <AccountAreaLayout>
                    <Routes>
                      <Route path="profile" element={<AccountProfilePage />} />
                      <Route path="orders" element={<AccountOrdersPage />} />
                      <Route path="loyalty" element={<AccountLoyaltyPage />} />
                      <Route index element={<Navigate to="profile" />} />
                      <Route path="*" element={<Navigate to="profile" replace />} />
                    </Routes>
                  </AccountAreaLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:productId" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="order-cancelled" element={<OrderCancelledPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="compare" element={<CompareProductsPage />} />
                  <Route path="request-quote" element={<RequestQuotePage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="shipping" element={<ShippingPolicyPage />} />
                  <Route path="privacy" element={<PrivacyPolicyPage />} />
                  <Route path="manual" element={<UserManualPage />} />
                  <Route 
                      path="exclusive-content" 
                      element={
                        <ProtectedRoute allowedRoles={['cliente', 'admin', 'agente']}>
                          <ExclusiveContentPage />
                        </ProtectedRoute>
                      } 
                    />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } />
          </Routes>
      );
    }
    
    function App() {
      return (
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <CurrencyProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ComparisonProvider>
                      <LoyaltyProvider>
                        <AppRoutes />
                        <Toaster />
                      </LoyaltyProvider>
                    </ComparisonProvider>
                  </WishlistProvider>
                </CartProvider>
              </CurrencyProvider>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      );
    }

    export default App;
  