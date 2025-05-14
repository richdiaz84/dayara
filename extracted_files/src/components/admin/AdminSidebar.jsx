
    import React from 'react';
    import { NavLink, Link, useNavigate } from 'react-router-dom'; 
    import { Home, ShoppingBag, Users, BarChart2, Settings, LogOut, Layers, Award, MessageSquare, FileText, PackageCheck, TerminalSquare } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';
    import HeaderLogo from '@/components/header/HeaderLogo';
    import {
      Accordion,
      AccordionContent,
      AccordionItem,
      AccordionTrigger,
    } from "@/components/ui/accordion";


    const AdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
      const { userRole, signOut } = useAuth(); 
      const navigate = useNavigate();

      const navLinkClasses = ({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out
        ${isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`;

      const subNavLinkClasses = ({ isActive }) =>
        `flex items-center pl-12 pr-4 py-2.5 text-xs font-medium rounded-md transition-colors duration-150 ease-in-out
        ${isActive
          ? 'bg-primary/5 text-primary'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }`;
        
      const handleLogout = async () => {
        await signOut();
        navigate('/'); 
      };

      const handleLinkClick = () => {
        if (window.innerWidth < 1024 && isSidebarOpen) { 
          toggleSidebar();
        }
      };

      return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-20 border-b border-border px-4">
              <Link to="/admin" onClick={handleLinkClick}>
                <HeaderLogo />
              </Link>
            </div>
            <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
              <NavLink to="/admin" end className={navLinkClasses} onClick={handleLinkClick}>
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={navLinkClasses} onClick={handleLinkClick}>
                <ShoppingBag className="w-5 h-5 mr-3" />
                Productos
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClasses} onClick={handleLinkClick}>
                <PackageCheck className="w-5 h-5 mr-3" />
                Pedidos
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClasses} onClick={handleLinkClick}>
                <Users className="w-5 h-5 mr-3" />
                Usuarios
              </NavLink>
              <NavLink to="/admin/banners" className={navLinkClasses} onClick={handleLinkClick}>
                <Layers className="w-5 h-5 mr-3" />
                Banners
              </NavLink>
              <NavLink to="/admin/quotes" className={navLinkClasses} onClick={handleLinkClick}>
                  <FileText className="w-5 h-5 mr-3" />
                  Cotizaciones
              </NavLink>
              <NavLink to="/admin/reviews" className={navLinkClasses} onClick={handleLinkClick}>
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Reseñas
              </NavLink>
               <NavLink to="/admin/loyalty" className={navLinkClasses} onClick={handleLinkClick}>
                  <Award className="w-5 h-5 mr-3" />
                  Lealtad
              </NavLink>
              <NavLink to="/admin/reports" className={navLinkClasses} onClick={handleLinkClick}>
                <BarChart2 className="w-5 h-5 mr-3" />
                Reportes
              </NavLink>
              {(userRole === 'admin' || userRole === 'agente') && (
                <NavLink to="/agent/pos" className={navLinkClasses} onClick={handleLinkClick}>
                  <TerminalSquare className="w-5 h-5 mr-3" />
                  TPV (Punto de Venta)
                </NavLink>
              )}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="settings" className="border-none">
                  <AccordionTrigger className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out text-muted-foreground hover:bg-muted hover:text-foreground hover:no-underline focus:no-underline`}>
                    <Settings className="w-5 h-5 mr-3" />
                    Configuración
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <NavLink to="/admin/settings/general" className={subNavLinkClasses} onClick={handleLinkClick}>
                        General
                    </NavLink>
                    <NavLink to="/admin/settings/payments" className={subNavLinkClasses} onClick={handleLinkClick}>
                        Pagos
                    </NavLink>
                    <NavLink to="/admin/settings/shipping" className={subNavLinkClasses} onClick={handleLinkClick}>
                        Envíos
                    </NavLink>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>
            <div className="p-4 mt-auto border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10 transition-colors duration-150 ease-in-out"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>
      );
    };

    export default AdminSidebar;
  