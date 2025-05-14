
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import HeaderLogo from '@/components/header/HeaderLogo';
    import HeaderDesktopNav from '@/components/header/HeaderDesktopNav';
    import HeaderMobileMenu from '@/components/header/HeaderMobileMenu';
    import HeaderMobileToggle from '@/components/header/HeaderMobileToggle';
    import HeaderActions from '@/components/header/HeaderActions';
    import HeaderSearchOverlay from '@/components/header/HeaderSearchOverlay';
    import { useTheme } from '@/contexts/ThemeContext';

    const Header = () => {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [isSearchOpen, setIsSearchOpen] = useState(false);
      const { isDarkMode, toggleDarkMode } = useTheme();
      const { user, signOut, loading: authLoading } = useAuth();
      const navigate = useNavigate();

      const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
      const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

      const handleSignOut = async () => {
        await signOut();
        setIsMobileMenuOpen(false);
        navigate('/');
      };
      
      const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Productos', path: '/products' },
      ];

      return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm dark:shadow-primary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <HeaderLogo />
              <HeaderDesktopNav navLinks={navLinks} />

              <div className="flex items-center space-x-1 sm:space-x-2">
                <HeaderActions 
                  user={user} 
                  authLoading={authLoading}
                  handleSignOut={handleSignOut}
                  toggleSearch={toggleSearch}
                  toggleDarkMode={toggleDarkMode}
                  isDarkMode={isDarkMode}
                  navigate={navigate}
                />
                <HeaderMobileToggle isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
              </div>
            </div>
          </div>

          <HeaderMobileMenu 
            isOpen={isMobileMenuOpen} 
            toggleMenu={toggleMobileMenu} 
            navLinks={navLinks} 
            user={user}
            navigate={navigate}
            handleSignOut={handleSignOut}
          />
          <HeaderSearchOverlay isOpen={isSearchOpen} toggleSearch={toggleSearch} />
        </header>
      );
    };

    export default Header;
  