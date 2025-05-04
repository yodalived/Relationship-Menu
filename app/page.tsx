'use client';

import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import { LoadingIndicator } from './components/ui/LoadingIndicator';
import { Container } from './components/ui/Container';
import { MenuData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { migrateMenuData } from './utils/migrations';
import {
  LEGACY_MENU_KEY,
  getAllMenus,
  saveMenu
} from './utils/menuStorage';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Load saved menus on initial render
  useEffect(() => {
    const loadSavedMenus = () => {
      setIsLoading(true);
      
      if (!isBrowser) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Migrate any legacy data first
        migrateFromLegacyFormat();
        
        // Load the menu list - we don't need to store it in state anymore
        getAllMenus();
      } catch (error) {
        console.error('Error loading saved menus:', error);
      }
      
      setIsLoading(false);
    };
    
    loadSavedMenus();
  }, []);
  
  // Helper to migrate from legacy storage format to the new one
  const migrateFromLegacyFormat = () => {
    if (!isBrowser) return;
    
    try {
      const legacyData = localStorage.getItem(LEGACY_MENU_KEY);
      if (legacyData) {
        const parsedData = JSON.parse(legacyData) as MenuData;
        const migratedData = migrateMenuData(parsedData);
        
        // Ensure it has a UUID
        if (!migratedData.uuid) {
          migratedData.uuid = uuidv4();
        }
        
        // Save to new format
        saveMenu(migratedData);
        
        // Remove the legacy data
        localStorage.removeItem(LEGACY_MENU_KEY);
      }
    } catch (error) {
      console.error('Error migrating legacy data:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container>
        <LoadingIndicator message="Loading saved menus..." />
      </Container>
    );
  }

  return (
    <Container>
      <LandingPage />
    </Container>
  );
}
