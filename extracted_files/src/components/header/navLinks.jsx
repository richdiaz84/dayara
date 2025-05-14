
    import React from 'react';

    export const baseNavLinks = [
      { name: 'Inicio', path: '/' },
      { name: 'Productos', path: '/products' },
    ];

    export const accountLinks = [
      { name: 'Mi Perfil', path: '/account/profile' },
      { name: 'Mis Pedidos', path: '/account/orders' },
    ];

    export const adminLinks = [
      { name: 'Dashboard', path: '/admin' },
    ];
    
    export const agentLinks = [
       { name: 'TPV', path: '/agent/pos' },
    ];

    export const getNavLinks = (user, userRole) => {
      let links = [...baseNavLinks];
      if (user) {
        if (userRole === 'admin') {
          links = [...links, ...adminLinks, ...agentLinks, ...accountLinks];
        } else if (userRole === 'agente') {
          links = [...links, ...agentLinks, ...accountLinks];
        } else {
           links = [...links, ...accountLinks];
        }
      }
      
      return links.filter((link, index, self) => 
          index === self.findIndex((l) => (
              l.path === link.path && l.name === link.name
          ))
      );
    };
  