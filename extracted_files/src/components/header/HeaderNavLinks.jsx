
    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';

    const HeaderNavLinks = ({ navLinks, linkClassName, ulClassName, onLinkClick }) => {
      const defaultLinkClass = "text-sm font-medium transition-colors hover:text-primary dark:hover:text-primary";
      const activeLinkClass = "text-primary dark:text-primary";

      return (
        <ul className={ulClassName}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                onClick={onLinkClick}
                className={({ isActive }) => 
                  `${linkClassName || defaultLinkClass} ${isActive ? activeLinkClass : 'text-foreground/70 dark:text-foreground/70'}`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      );
    };

    export default HeaderNavLinks;
  