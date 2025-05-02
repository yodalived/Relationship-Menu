'use client';

import { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { IconMust, IconLike, IconMaybe, IconOffLimit } from "../icons";

export default function ShowLegendWhenMenuActive() {
  const [showLegend, setShowLegend] = useState(false);
  const pathname = usePathname();
  
  // List of paths where we should hide the legend
  const nonMenuPaths = useMemo(() => ['/privacy-policy', '/legal-disclosure'], []);
  
  useEffect(() => {
    // Only show legend if we have menu data AND we're not on a non-menu page
    const hasMenu = localStorage.getItem('relationship_menu_data') !== null;
    const isMenuPage = !nonMenuPaths.includes(pathname);
    setShowLegend(hasMenu && isMenuPage);
    
    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = () => {
      const hasMenu = localStorage.getItem('relationship_menu_data') !== null;
      setShowLegend(hasMenu && isMenuPage);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when menu data changes within the same window
    window.addEventListener('menuDataChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuDataChanged', handleStorageChange);
    };
  }, [pathname, nonMenuPaths]);
  
  if (!showLegend) return null;
  
  return (
    <div className="legend">
      <div className="must flex items-center">
        <IconMust />
        <span className="ml-1 dark:text-[rgba(59,130,246,1)]">Must have</span>
      </div>
      <div className="like flex items-center">
        <IconLike />
        <span className="ml-1 dark:text-[rgba(34,197,94,1)]">Would like</span>
      </div>
      <div className="maybe flex items-center">
        <IconMaybe />
        <span className="ml-1 dark:text-[rgba(245,158,11,1)]">Maybe</span>
      </div>
      <div className="off-limit flex items-center">
        <IconOffLimit />
        <span className="ml-1 dark:text-[rgba(239,68,68,1)]">Off limits</span>
      </div>
    </div>
  );
} 