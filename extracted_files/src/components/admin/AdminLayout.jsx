
    import React, { useState, useEffect } from 'react';
    import AdminSidebar from '@/components/admin/AdminSidebar';
    import AdminHeader from '@/components/admin/AdminHeader';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useLocation } from 'react-router-dom'; // Import useLocation

    const AdminLayout = ({ children }) => {
      const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
      const location = useLocation(); // Get location object

      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
          } else {
            setIsSidebarOpen(true);
          }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      
      const mainContentVariants = {
        open: { marginLeft: '16rem', width: 'calc(100% - 16rem)' }, // 256px = 16rem
        closed: { marginLeft: '5rem', width: 'calc(100% - 5rem)' } // 80px = 5rem
      };
      
      const mobileMainContentVariants = {
        open: { marginLeft: '0rem', width: '100%' }, // Sidebar overlays on mobile
        closed: { marginLeft: '0rem', width: '100%' }
      };


      return (
        <div className="flex h-screen bg-muted/40 dark:bg-background">
          <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AdminHeader toggleSidebar={toggleSidebar} />
            <motion.main 
              className="flex-1 p-4 overflow-x-hidden overflow-y-auto md:p-6 lg:p-8"
              variants={window.innerWidth >= 1024 ? mainContentVariants : mobileMainContentVariants}
              animate={isSidebarOpen ? "open" : "closed"}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </motion.main>
          </div>
        </div>
      );
    };

    export default AdminLayout;
  