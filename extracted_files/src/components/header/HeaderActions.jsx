
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import { ShoppingCart, Heart, Search, User, LogOut, ShieldCheck, LayoutDashboard, Layers, Loader2 } from 'lucide-react';
    import { useCart } from '@/contexts/CartContext';
    import { useWishlist } from '@/contexts/WishlistContext';
    import { useComparison } from '@/contexts/ComparisonContext';
    import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

    const HeaderActions = ({ toggleSearch }) => {
      const { user, userRole, loading: authLoading, signOut: handleSignOut } = useAuth(); // Get userRole and signOut from useAuth
      const navigate = useNavigate();
      const { cartCount } = useCart();
      const { wishlistItems } = useWishlist();
      const { comparisonItems } = useComparison();

      const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
      };
      
      const wishlistCount = wishlistItems.length;
      const comparisonCount = comparisonItems.length;

      return (
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="text-foreground/70 hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          {/* Theme toggle button removed */}
          
          <Button variant="ghost" size="icon" asChild className="relative text-foreground/70 hover:text-primary">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative text-foreground/70 hover:text-primary">
            <Link to="/compare">
              <Layers className="h-5 w-5" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {comparisonCount}
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="relative text-foreground/70 hover:text-primary">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {authLoading ? (
             <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-primary/50">
                    <AvatarImage src={user.user_metadata?.avatar_url || `https://avatar.vercel.sh/${user.email}.png`} alt={user.user_metadata?.full_name || user.email} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {getInitials(user.user_metadata?.full_name || user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border shadow-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{user.user_metadata?.full_name || 'Usuario'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/account/profile')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account/orders')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Mis Pedidos</span>
                </DropdownMenuItem>
                {(userRole === 'admin' || userRole === 'agente') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Panel Admin</span>
                  </DropdownMenuItem>
                )}
                 {(userRole === 'agente' || userRole === 'admin') && ( // Admin can also access POS
                  <DropdownMenuItem onClick={() => navigate('/agent/pos')} className="cursor-pointer hover:bg-muted focus:bg-muted">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>TPV</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/auth')} variant="default" size="sm" className="hidden sm:inline-flex">
              Acceder
            </Button>
          )}
        </div>
      );
    };
    export default HeaderActions;
  