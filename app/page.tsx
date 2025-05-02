'use client';

import { useRef, useEffect, useState } from 'react';
import { RelationshipMenu } from './components/RelationshipMenu/RelationshipMenu';
import LandingPage from './components/LandingPage';
import { useMenuStorage } from './utils/hooks/useMenuStorage';
import { LoadingIndicator } from './components/ui/LoadingIndicator';
import { Container } from './components/ui/Container';
import { MenuMode, MenuData } from './types';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

export default function Home() {
  const { menuData, isLoading, saveMenuData, clearMenuData } = useMenuStorage();
  const prevViewRef = useRef<'home' | 'menu'>('home');
  const [initialMode, setInitialMode] = useState<MenuMode>('view');

  // Handle scroll reset on view transitions
  useEffect(() => {
    const currentView = menuData ? 'menu' : 'home';
    
    // Only scroll to top when transitioning from home to menu view
    if (prevViewRef.current === 'home' && currentView === 'menu' && isBrowser) {
      window.scrollTo(0, 0);
    }
    
    prevViewRef.current = currentView;
  }, [menuData]);

  if (isLoading) {
    return (
      <Container>
        <LoadingIndicator message="Loading saved menu..." />
      </Container>
    );
  }

  const handleFileLoaded = (data: MenuData, mode: MenuMode = 'view') => {
    setInitialMode(mode);
    saveMenuData(data);
  };

  return (
    <Container>
      {!menuData ? (
        <LandingPage onFileLoaded={handleFileLoaded} />
      ) : (
        <RelationshipMenu 
          menuData={menuData} 
          onReset={clearMenuData} 
          onSave={saveMenuData}
          initialMode={initialMode}
        />
      )}
    </Container>
  );
}
