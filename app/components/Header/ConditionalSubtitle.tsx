'use client';

import { useEffect, useState } from 'react';

export default function ConditionalSubtitle() {
  const [showSubtitle, setShowSubtitle] = useState(true);
  
  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;
    
    // Check if we have menu data in localStorage
    const hasMenu = localStorage.getItem('relationship_menu_data') !== null;
    setShowSubtitle(!hasMenu);
    
    // Set up storage event listener to update when localStorage changes
    const handleStorageChange = () => {
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
  }, []);
  
  if (!showSubtitle) return null;
  
  return (
    <p className="subtitle">
      Create unique relationship agreements, free from traditional expectations.
    </p>
  );
} 