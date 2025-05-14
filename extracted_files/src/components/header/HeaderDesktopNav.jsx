
    import React from 'react';
    import HeaderNavLinks from '@/components/header/HeaderNavLinks';

    const HeaderDesktopNav = ({ navLinks }) => {
      return (
        <nav className="hidden lg:flex space-x-6">
          <HeaderNavLinks navLinks={navLinks} />
        </nav>
      );
    };

    export default HeaderDesktopNav;
  