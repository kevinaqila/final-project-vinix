import { useState, useEffect } from 'react';

const useSidebarState = () => {
  // Get initial state from localStorage or default to true (open)
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    // Default: open on desktop, closed on mobile
    if (saved === null) {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return saved === 'true';
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', isOpen.toString());
  }, [isOpen]);

  // Handle window resize to auto-adjust on mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Auto-close on mobile if not manually set
      if (width < 1024 && isOpen && localStorage.getItem('sidebarOpen') === null) {
        setIsOpen(false);
      }
      // Auto-open on desktop if not manually set
      if (width >= 1024 && !isOpen && localStorage.getItem('sidebarOpen') === null) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return { isOpen, setIsOpen, toggleSidebar };
};

export default useSidebarState;