import { MenuData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { migrateMenuData } from './migrations';
import { getMenuById, saveMenu } from './menuStorage';

interface ImportConflict {
  exists: boolean;
  isNewer: boolean;
  data: MenuData;
  id: string;
}

/**
 * Process a shared link with compressed menu data
 */
export async function processSharedLink(
  hash: string,
  setImportConflict: (conflict: ImportConflict | null) => void
): Promise<boolean> {
  try {
    const params = new URLSearchParams(hash);
    
    // Check for data_v1 parameter (compressed menu data)
    const urlData = params.get('data_v1');
    
    if (urlData) {
      // Dynamically import LZString to keep bundle size small
      const LZString = await import('lz-string');
      
      // Replace manually encoded %2B back to + before decompression
      const fixedUrlData = urlData.replace(/%2B/g, '+');
      
      // Decompress and parse the URL data
      const decompressed = LZString.default.decompressFromEncodedURIComponent(fixedUrlData);
      if (decompressed) {
        const parsedData = JSON.parse(decompressed) as MenuData;
        
        // Migrate data to latest schema version
        const migratedData = migrateMenuData(parsedData);
        
        // Ensure we have a UUID
        if (!migratedData.uuid) {
          migratedData.uuid = uuidv4();
        }
        
        const menuId = migratedData.uuid;
        
        // Check if this menu already exists
        const existingMenu = getMenuById(menuId);
        
        if (existingMenu) {
          // Menu exists, check dates
          const existingDate = new Date(existingMenu.last_update).getTime();
          const importedDate = new Date(migratedData.last_update).getTime();
          
          // If timestamps are identical, just open the existing menu
          if (existingDate === importedDate) {
            window.location.href = `/editor#id=${menuId}&mode=view`;
            return true;
          }
          
          const isNewer = importedDate > existingDate;
          
          // Show conflict dialog
          setImportConflict({
            exists: true,
            isNewer,
            data: migratedData,
            id: menuId
          });
          
          // Clear hash to avoid reprocessing on page refresh
          window.history.replaceState(null, document.title, window.location.pathname);
          return true;
        } else {
          // Menu doesn't exist, save the new menu
          saveMenu(migratedData);
          
          // Navigate to the menu view
          window.location.href = `/editor#id=${menuId}&mode=view`;
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Error processing shared link:', error);
  }
  
  return false;
}

/**
 * Handle confirmation of importing a menu from a shared link
 */
export function handleConfirmImport(importConflict: ImportConflict | null): void {
  if (importConflict) {
    saveMenu(importConflict.data);
    window.location.href = `/editor#id=${importConflict.id}&mode=view`;
  }
}

/**
 * Handle cancellation of importing a menu from a shared link
 */
export function handleCancelImport(importConflict: ImportConflict | null): void {
  if (importConflict) {
    window.location.href = `/editor#id=${importConflict.id}&mode=view`;
  }
}

/**
 * Create a shareable URL for a menu
 */
export function createShareableUrl(menuData: MenuData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Dynamically import LZString
      import('lz-string')
        .then((LZString) => {
          // Compress the JSON data
          const jsonString = JSON.stringify(menuData);
          const compressedData = LZString.default.compressToEncodedURIComponent(jsonString);
          
          // Manually replace any + with %2B to ensure compatibility with messaging apps
          const safeCompressedData = compressedData.replace(/\+/g, '%2B');
          
          // Create the URL with the compressed data as a fragment (not a query parameter)
          // Always use the root URL
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const url = `${baseUrl}/#data_v1=${safeCompressedData}`;
          
          resolve(url);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Copy text to clipboard with error handling
 * @returns Object with success flag and error message if failed
 */
export async function copyToClipboard(text: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Try using the Clipboard API first
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    console.error('Clipboard API failed:', err);
    
    // Check for permission errors
    if (err instanceof Error && err.name === 'NotAllowedError') {
      return { 
        success: false, 
        error: 'Clipboard access denied. Please check browser permissions.' 
      };
    }
    
    // Try fallback method
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Failed to copy text. Try again or copy manually.' 
        };
      }
    } catch (fallbackError) {
      console.error('Fallback clipboard method failed:', fallbackError);
      return { 
        success: false, 
        error: 'Failed to copy text. Please try again.' 
      };
    }
  }
} 