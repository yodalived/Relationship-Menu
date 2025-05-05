'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ImportConflictModal } from './components/FileSelector/ImportConflictModal';
import { 
  processSharedLink, 
  handleConfirmImport, 
  handleCancelImport 
} from './utils/urlProcessor';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [importConflict, setImportConflict] = useState<{
    exists: boolean;
    isNewer: boolean;
    data: MenuData;
    id: string;
  } | null>(null);

  // Load saved menus on initial render
  useEffect(() => {
    // Process URL hash data when the hash changes
    const processHash = async () => {
      if (isBrowser && window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        await processSharedLink(hash, setImportConflict, router);
      }
    };

    const loadSavedMenus = async () => {
      setIsLoading(true);
      
      if (!isBrowser) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if there's data in the URL hash (shared link)
        await processHash();
        
        // Migrate any legacy data
        migrateFromLegacyFormat();
        
        // Load the menu list
        getAllMenus();
      } catch (error) {
        console.error('Error loading saved menus:', error);
      }
      
      setIsLoading(false);
    };
    
    loadSavedMenus();
    
    // Add hashchange event listener to detect hash changes while the page is open
    const handleHashChange = () => {
      processHash();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router]);
  
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

  // Handlers for the import conflict modal
  const onConfirmImport = () => {
    handleConfirmImport(importConflict, router);
    setImportConflict(null);
  };

  const onCancelImport = () => {
    handleCancelImport(importConflict, router);
    setImportConflict(null);
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
      
      {/* Import conflict modal */}
      <ImportConflictModal
        conflict={importConflict}
        onConfirm={onConfirmImport}
        onCancel={onCancelImport}
      />
    </Container>
  );
}
