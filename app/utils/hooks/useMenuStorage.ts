import { useState, useEffect } from 'react';
import { MenuData } from '../../types';
import { migrateMenuData } from '../migrations';
import LZString from 'lz-string';

// LocalStorage key
const MENU_STORAGE_KEY = 'relationship_menu_data';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

export function useMenuStorage() {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage or URL fragment on initial render
  useEffect(() => {
    setIsLoading(true);
    
    if (isBrowser) {
      try {
        // First check if there's data in the URL fragment
        if (window.location.hash) {
          const hashData = window.location.hash.substring(1); // Remove the # symbol
          const hashParams = new URLSearchParams(hashData);
          
          // Check for data_v1 first (new format)
          let urlData = hashParams.get('data_v1');
          
          // If data_v1 not found, check for legacy data format
          if (!urlData) {
            urlData = hashParams.get('data');
          }
          
          if (urlData) {
            try {
              // Replace manually encoded %2B back to + before decompression
              urlData = urlData.replace(/%2B/g, '+');
              
              // Decompress and parse the URL data
              const decompressed = LZString.decompressFromEncodedURIComponent(urlData);
              if (decompressed) {
                const parsedData = JSON.parse(decompressed) as MenuData;
                
                // Migrate data to latest schema version
                const migratedData = migrateMenuData(parsedData);
                
                setMenuData(migratedData);
                // Also save to localStorage
                localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(migratedData));
                // Clear the URL fragment to avoid sharing issues
                window.history.replaceState({}, document.title, window.location.pathname);
                setIsLoading(false);
                return;
              }
            } catch (err) {
              console.error('Error parsing URL data:', err);
            }
          }
        }
        
        // If no URL data or parsing failed, try localStorage
        const savedData = localStorage.getItem(MENU_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData) as MenuData;
          
          // Migrate data to latest schema version
          const migratedData = migrateMenuData(parsedData);
          
          setMenuData(migratedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Save menu data to localStorage
  const saveMenuData = (data: MenuData) => {
    setMenuData(data);
    
    if (isBrowser) {
      try {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(data));
        // Dispatch custom event to notify components that menu data has changed
        window.dispatchEvent(new Event('menuDataChanged'));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  };

  // Clear menu data from localStorage
  const clearMenuData = () => {
    setMenuData(null);
    
    if (isBrowser) {
      try {
        localStorage.removeItem(MENU_STORAGE_KEY);
        // Dispatch custom event to notify components that menu data has changed
        window.dispatchEvent(new Event('menuDataChanged'));
      } catch (error) {
        console.error('Error removing data from localStorage:', error);
      }
    }
  };

  return {
    menuData,
    isLoading,
    saveMenuData,
    clearMenuData
  };
} 