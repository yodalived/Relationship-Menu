'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';

export default function ConditionalSubtitle() {
  const [showSubtitle, setShowSubtitle] = useState(true);
  const pathname = usePathname();
  
  // Define paths where we should hide the subtitle
  const menuPaths = useMemo(() => ['/editor/'], []);
  
  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;
    
    // Don't show subtitle on specific menu paths
    if (menuPaths.includes(pathname)) {
      setShowSubtitle(false);
      return;
    }
    
    // Check if we have menu data in localStorage
    const hasMenu = localStorage.getItem('relationship_menu_data') !== null;
    setShowSubtitle(!hasMenu);
    
    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = () => {
      // Don't change state if we're on a menu path
      if (menuPaths.includes(pathname)) return;
      
      const hasMenu = localStorage.getItem('relationship_menu_data') !== null;
      setShowSubtitle(!hasMenu);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when menu data changes within the same window
    window.addEventListener('menuDataChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuDataChanged', handleStorageChange);
    };
  }, [pathname, menuPaths]);
  
  if (!showSubtitle) return null;
  
  return (
    <p className="hidden sm:block text-white/90 text-base font-normal m-0 pb-1.5 whitespace-nowrap sm:whitespace-normal sm:max-w-[90%] leading-normal">
      Create unique relationship agreements, free from traditional expectations.
    </p>
  );
} 