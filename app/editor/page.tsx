'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RelationshipMenu } from '../components/RelationshipMenu/RelationshipMenu';
import { LoadingIndicator } from '../components/ui/LoadingIndicator';
import { Container } from '../components/ui/Container';
import { MenuMode, MenuData } from '../types';
import { getMenuById, saveMenu, getAllMenus } from '../utils/menuStorage';
import { ErrorModal } from '../components/ui/ErrorModal';
import { FileSelector } from '../components/FileSelector';
import TemplateSelector from '../components/TemplateSelector/TemplateSelector';

export default function EditorPage() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialMode, setInitialMode] = useState<MenuMode>('view');
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [error, setError] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: '', message: '' });

  // Update document title when menu data changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Function to update the title
    const updateTitle = () => {
      if (menuData?.people && menuData.people.length > 0) {
        // Filter out empty names and join the remaining ones
        const validNames = menuData.people.filter(name => name && name.trim() !== '');
        
        if (validNames.length > 0) {
          const nameString = validNames.join(' & ');
          document.title = `Relationship Menu - ${nameString}`;
        } else {
          document.title = 'Relationship Menu - Editor';
        }
      } else {
        document.title = 'Relationship Menu - Editor';
      }
    };

    // Update immediately
    updateTitle();
    
    // And also after a short delay to ensure it happens after any other rendering
    const timeoutId = setTimeout(updateTitle, 500);
    
    return () => clearTimeout(timeoutId);
  }, [menuData]);

  // Load the menu based on the hash ID
  useEffect(() => {
    const loadMenuFromHash = () => {
      setIsLoading(true);
      setError({ show: false, title: '', message: '' });
      setShowFileSelector(false);
      setShowTemplateSelector(false);
      
      try {
        // Extract ID from hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const menuId = params.get('id');
        const modeParam = params.get('mode');
        
        // Set the initial mode from URL parameter if it exists
        if (modeParam && ['view', 'fill', 'edit'].includes(modeParam)) {
          setInitialMode(modeParam as MenuMode);
          
          // Remove the mode parameter from the URL after using it
          if (menuId) {
            // Update the URL without triggering a navigation
            const cleanHash = `#id=${menuId}`;
            window.history.replaceState(
              null, 
              '', 
              window.location.pathname + cleanHash
            );
          }
        }
        
        if (!menuId) {
          console.warn('No menu ID found in URL hash');
          setIsLoading(false);
          
          // Check if there are any saved menus
          const menus = getAllMenus();
          
          // Show the appropriate selector
          if (menus.length > 0) {
            setShowFileSelector(true);
          } else {
            setShowTemplateSelector(true);
          }
          return;
        }
        
        // Try to load menu from localStorage
        const menu = getMenuById(menuId);
        
        if (!menu) {
          console.warn(`Menu with ID ${menuId} not found`);
          setIsLoading(false);
          setError({
            show: true,
            title: 'Menu Not Found',
            message: `The menu you're looking for (ID: ${menuId.substring(0, 6)}...) could not be found. It may have been deleted or might not exist.`
          });
          return;
        }
        
        // Set the menu data
        setMenuData(menu);
        setIsLoading(false);
        
        // Notify components that menu data has changed
        window.dispatchEvent(new Event('menuDataChanged'));
      } catch (error) {
        console.error('Error loading menu:', error);
        setIsLoading(false);
        setError({
          show: true,
          title: 'Error Loading Menu',
          message: 'An unexpected error occurred while trying to load the menu. Please try again or return to the home page.'
        });
      }
    };
    
    // Load menu on initial render
    loadMenuFromHash();
    
    // Also handle hash changes
    const handleHashChange = () => {
      loadMenuFromHash();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [router]);

  // Handle menu data saving
  const handleSaveMenu = (updatedMenu: MenuData) => {
    try {
      // Ensure we have a uuid
      if (!updatedMenu.uuid) {
        console.error('Cannot save menu without UUID');
        return;
      }
      
      // Save the menu
      saveMenu(updatedMenu);
      
      // Update our state
      setMenuData(updatedMenu);
    } catch (error) {
      console.error('Error saving menu:', error);
      setError({
        show: true,
        title: 'Error Saving Menu',
        message: 'An unexpected error occurred while trying to save your menu. Your changes may not have been saved.'
      });
    }
  };

  // Handle switching to template selector
  const handleCreateNewMenu = () => {
    setShowFileSelector(false);
    setShowTemplateSelector(true);
  };

  // Handle switching to file selector
  const handleOpenExistingMenu = () => {
    setShowTemplateSelector(false);
    setShowFileSelector(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container>
        <LoadingIndicator message="Loading menu..." />
      </Container>
    );
  }
  
  // Show template selector modal if the user wants to create a new menu
  if (showTemplateSelector) {
    return (
      <TemplateSelector 
        isModal={true}
        onMenuPageWithNoMenu={true}
        onClose={handleOpenExistingMenu}
      />
    );
  }
  
  // Show file selector modal if no menu ID provided
  if (showFileSelector) {
    return (
      <FileSelector 
        isModal={true}
        onMenuPageWithNoMenu={true}
        onCreateNewMenu={handleCreateNewMenu}
        onClose={() => router.replace('/')}
      />
    );
  }
  
  // Show error modal if there's an error
  if (error.show) {
    return <ErrorModal title={error.title} message={error.message} buttonText="Return to Home" />;
  }
  
  // Show the menu if loaded
  if (menuData) {
    return (
      <Container>
        <RelationshipMenu 
          menuData={menuData} 
          onSave={handleSaveMenu}
          initialMode={initialMode}
        />
      </Container>
    );
  }
  
  // Fallback - should never happen as we handle all states above
  return (
    <Container>
      <div className="text-center p-8">
        <h2 className="text-xl mb-4">Something went wrong</h2>
        <p className="mb-4">Unable to determine menu state.</p>
        <button 
          onClick={() => router.replace('/')}
          className="px-4 py-2 bg-[rgba(148,188,194,0.2)] hover:bg-[rgba(148,188,194,0.3)] text-[rgba(79,139,149,1)] rounded-md transition-colors"
        >
          Return to Home
        </button>
      </div>
    </Container>
  );
} 