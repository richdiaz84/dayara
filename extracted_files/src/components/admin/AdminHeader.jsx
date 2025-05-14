
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Menu, Bell, Search } from 'lucide-react'; // Removed Moon, Sun
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    // useTheme removed as theme is fixed
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { useAuth } from '@/contexts/AuthContext';

    const AdminHeader = ({ toggleSidebar }) => {
      // theme and toggleTheme removed
      const { user, signOut } = useAuth();
      const navigate = useNavigate();

      return (
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border lg:px-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2 text-muted-foreground" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Buscar en el panel..." className="pl-10 w-64 bg-background border-border focus:border-primary" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme toggle button removed */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card border-border shadow-lg">
                <DropdownMenuLabel className="font-semibold">Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-muted">
                  <p className="text-sm font-medium">Nuevo pedido #1025 recibido</p>
                  <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-muted">
                  <p className="text-sm font-medium">Stock bajo para 'Glitter Bomb'</p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/notifications')} className="text-center text-primary hover:underline p-2 cursor-pointer">
                  Ver todas las notificaciones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted">
                  <img  
                    alt={user?.user_metadata?.full_name || user?.email || 'User Avatar'} 
                    className="h-8 w-8 rounded-full object-cover border border-primary/50"
                   src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email || 'D')}&background=random&color=fff`} />
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-lg">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account/profile" className="cursor-pointer hover:bg-muted focus:bg-muted">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings/general" className="cursor-pointer hover:bg-muted focus:bg-muted">Configuración</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive">
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      );
    };

    export default AdminHeader;
  