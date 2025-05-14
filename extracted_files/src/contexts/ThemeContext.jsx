
    import React, { createContext, useState, useEffect, useContext } from 'react';

    const ThemeContext = createContext();

    export const useTheme = () => useContext(ThemeContext);

    export const ThemeProvider = ({ children }) => {
      // Default to 'dark' theme and remove theme toggling logic
      const [theme] = useState('dark');

      useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark'); // Remove any existing theme class
        root.classList.add('dark'); // Always apply 'dark'
        // No need to use localStorage if theme is fixed
      }, []); // Empty dependency array ensures this runs only once on mount

      // toggleTheme function is removed as theme is fixed
      // The value provided by context only includes the current theme
      return (
        <ThemeContext.Provider value={{ theme }}>
          {children}
        </ThemeContext.Provider>
      );
    };
  