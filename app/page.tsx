'use client';

import { useState, useEffect } from 'react';
import MenuDisplay from './components/MenuDisplay';
import HomePage from './components/HomePage';
import LZString from 'lz-string';
import { MenuData } from './types';
import { migrateMenuData } from './utils/migrations';

// LocalStorage key
const MENU_STORAGE_KEY = 'relationship_menu_data';

// Check if we're running in the browser
const isBrowser = typeof window !== 'undefined';

export default function Home() {
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

  // Handler for when file is loaded
  const handleFileLoaded = (data: MenuData) => {
    setMenuData(data);
    
    // Save to localStorage
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

  // Handler for resetting the menu
  const handleReset = () => {
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

  const handleSaveChanges = (updatedData: MenuData) => {
    setMenuData(updatedData);
    
    // Save to localStorage
    if (isBrowser) {
      try {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedData));
        // Dispatch custom event to notify components that menu data has changed
        window.dispatchEvent(new Event('menuDataChanged'));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--main-bg-color)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading saved menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {!menuData ? (
        <HomePage onFileLoaded={handleFileLoaded} />
      ) : (
        <MenuDisplay 
          menuData={menuData} 
          onReset={handleReset} 
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
}
