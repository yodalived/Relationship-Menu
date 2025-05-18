'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MenuData } from '../../types';
import { migrateMenuData } from '../../utils/migrations';
import { extractMenuDataFromPDF } from '../../utils/pdf/extract';
import { getAllMenus, MenuInfo, deleteMenu, saveMenu, updateMenuList, getMenuById } from '../../utils/menuStorage';
import { ImportConflictModal } from './ImportConflictModal';
import { DeleteMenuModal } from './DeleteMenuModal';
import { v4 as uuidv4 } from 'uuid';
import { MenuList } from './MenuList';
import { FileUploader } from './FileUploader';
import { ErrorDisplay } from './ErrorDisplay';

interface FileSelectorProps {
  isModal?: boolean;
  onClose?: () => void;
  onMenuPageWithNoMenu?: boolean;
  onCreateNewMenu?: () => void;
}

export function FileSelector({ isModal = false, onClose, onMenuPageWithNoMenu = false, onCreateNewMenu }: FileSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedMenus, setSavedMenus] = useState<MenuInfo[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);
  const [importConflict, setImportConflict] = useState<{
    exists: boolean;
    isNewer: boolean;
    data: MenuData;
    id: string;
  } | null>(null);

  // Load saved menus on component mount
  useEffect(() => {
    loadSavedMenus();
  }, []);

  // Get the current menu ID from URL search params
  const getCurrentMenuId = (): string | null => {
    return searchParams.get('id');
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isModal]);

  const loadSavedMenus = () => {
    try {
      const menus = getAllMenus();
      setSavedMenus(menus);
    } catch (error) {
      console.error('Error loading saved menus:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file?: File) => {
    setError(null);
    setIsProcessing(true);
    
    if (!file) {
      setError('No file selected');
      setIsProcessing(false);
      return;
    }

    try {
      // Check if it's a PDF file
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          // Convert the file to an ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Use the utility function to extract menu data
          const menuData = await extractMenuDataFromPDF(arrayBuffer);
          
          if (menuData) {
            handleFileLoaded(menuData);
            setIsProcessing(false);
            return;
          }
          
          setError('No relationship menu data found in this PDF');
          setIsProcessing(false);
        } catch (err) {
          console.error('Error processing PDF:', err);
          setError('Failed to extract data from PDF. Please select a JSON file instead.');
          setIsProcessing(false);
        }
        return;
      }
      
      // Process JSON files
      if (file.type !== 'application/json' && !file.name.endsWith('.json') && !file.name.endsWith('.relationshipmenu')) {
        setError('Please select a .json, .relationshipmenu, or .pdf file');
        setIsProcessing(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as MenuData;
          
          // Validate the data structure
          if (!data.last_update || !Array.isArray(data.people) || !Array.isArray(data.menu)) {
            throw new Error('Invalid JSON structure. The file must contain last_update, people, and menu fields.');
          }
          
          // Migrate data to latest schema version
          const migratedData = migrateMenuData(data);
          
          handleFileLoaded(migratedData);
          setIsProcessing(false);
        } catch (err) {
          setError((err as Error).message || 'Failed to parse JSON file');
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      
      reader.readAsText(file);
    } catch (err) {
      setError((err as Error).message || 'Failed to process file');
      setIsProcessing(false);
    }
  };

  // Method to handle the file being loaded
  const handleFileLoaded = (data: MenuData) => {
    // Ensure we have a UUID
    const importedData = { ...data };
    if (!importedData.uuid) {
      importedData.uuid = uuidv4();
    }
    
    const menuId = importedData.uuid;

    // Prevent importing example menu
    if (menuId === 'example') {
      setError('Cannot import the example menu. Please create a new menu instead.');
      return;
    }
    
    // Check if this menu already exists
    const existingMenu = getMenuById(menuId);
    
    if (existingMenu) {
      // Menu exists, check dates
      const existingDate = new Date(existingMenu.last_update).getTime();
      const importedDate = new Date(importedData.last_update).getTime();
      
      // If timestamps are identical, just open the existing file
      if (existingDate === importedDate) {
        // Close the modal if it's open
        if (isModal && onClose) {
          onClose();
        }
        
        // Open the existing menu
        router.push(`/editor?id=${menuId}&mode=view`);
        return;
      }
      
      const isNewer = importedDate > existingDate;
      
      // Show conflict dialog
      setImportConflict({
        exists: true,
        isNewer,
        data: importedData,
        id: menuId
      });
    } else {
      saveMenu(importedData);
      updateMenuList(importedData);
      
      // Close the modal if it's open
      if (isModal && onClose) {
        onClose();
      }
      
      // Always open existing menus in view mode
      router.push(`/editor?id=${menuId}&mode=view`);
    }
  };

  // Handle confirming an import (replacing existing menu)
  const handleConfirmImport = () => {
    if (importConflict) {
      saveMenu(importConflict.data);
      updateMenuList(importConflict.data);
      
      // Close the modal if it's open
      if (isModal && onClose) {
        onClose();
      }
      
      router.push(`/editor?id=${importConflict.id}&mode=view`);
      setImportConflict(null);
    }
  };

  // Handle canceling an import (keeping existing menu)
  const handleCancelImport = () => {
    if (importConflict) {
      // Close the modal if it's open
      if (isModal && onClose) {
        onClose();
      }
      
      router.push(`/editor?id=${importConflict.id}&mode=view`);
      setImportConflict(null);
    }
  };

  const handleMenuSelect = (menuId: string) => {
    if (isModal && onClose) {
      onClose(); // Close the modal when a menu is selected
    }
    
    // Always open existing menus in view mode
    router.push(`/editor?id=${menuId}&mode=view`);
  };

  const handleMenuDelete = (menuId: string, event: React.MouseEvent) => {
    // Stop propagation to prevent opening the menu
    event.stopPropagation();
    
    // Set the menu ID to delete and show the modal
    setMenuToDelete(menuId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (menuToDelete) {
      try {
        deleteMenu(menuToDelete);
        
        // Check if the deleted menu is currently open
        const currentMenuId = getCurrentMenuId();
        if (currentMenuId === menuToDelete) {
          router.push('/editor/');
        }
        
        // Refresh the menu list
        loadSavedMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
        setError('Failed to delete menu');
      }
    }
    // Close the modal and reset the menuToDelete
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };
  
  const cancelDelete = () => {
    // Just close the modal and reset the menuToDelete
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  // Get the current menu ID
  const currentMenuId = getCurrentMenuId();
  
  // Handle file input click
  const handleFileInputClick = () => {
    if (!isProcessing) {
      document.getElementById('file-input')?.click();
    }
  };

  // Render modal version
  if (isModal) {
    return (
      <div className="fixed inset-0 z-[1000] overflow-y-auto flex items-center justify-center p-4" style={{ backdropFilter: 'blur(5px)' }}>
        <div className="absolute inset-0 bg-black/50 -z-10" onClick={onMenuPageWithNoMenu ? undefined : onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {onMenuPageWithNoMenu ? (
            <button 
              onClick={onCreateNewMenu}
              className="absolute right-4 top-4 text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] z-10 bg-white dark:bg-gray-800 rounded-md px-3 py-1 flex items-center justify-center shadow-md border border-[var(--main-bg-color)] dark:border-gray-700 modal-action-button"
              aria-label="Create new menu"
            >
              <span className="text-sm font-medium">New Menu</span>
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10 bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700"
              aria-label="Close"
            >
              <span className="text-xl">&times;</span>
            </button>
          )}
          <div className="p-4">
            <h2 className="text-xl font-bold text-[var(--main-text-color)] mb-4">Open Menu</h2>
            <div className="border-b border-gray-200 dark:border-gray-700 -mx-4 mb-4"></div>
            
            {/* Display saved menus if available */}
            {savedMenus.length > 0 && (
              <div className="mb-8">
                <MenuList 
                  menus={savedMenus}
                  currentMenuId={currentMenuId}
                  onMenuSelect={handleMenuSelect}
                  onMenuDelete={handleMenuDelete}
                />
              </div>
            )}
            
            {/* File uploader */}
            <FileUploader 
              isDragging={isDragging}
              isProcessing={isProcessing}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleFileInputClick}
              compact={savedMenus.length > 0}
            />
            
            <input 
              id="file-input"
              type="file" 
              accept=".json,.relationshipmenu,.pdf,application/json,application/pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            
            <ErrorDisplay error={error} />
          </div>
        </div>
        
        {/* Delete confirmation modal */}
        <DeleteMenuModal
          isOpen={showDeleteModal}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
        
        {/* Import conflict modal */}
        <ImportConflictModal
          conflict={importConflict}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      </div>
    );
  }

  // Render regular component
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16">
      <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-8 py-6">
        {savedMenus.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Open a Menu</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Select a saved menu to continue or import a new one</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Have an Existing Menu?</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Open your menu file to continue working on it</p>
          </>
        )}
      </div>

      <div className="p-4 sm:p-8">
        {/* Display saved menus if available */}
        {savedMenus.length > 0 && (
          <div className="mb-8">
            <MenuList 
              menus={savedMenus}
              currentMenuId={currentMenuId}
              onMenuSelect={handleMenuSelect}
              onMenuDelete={handleMenuDelete}
            />
          </div>
        )}
        
        {/* File uploader */}
        <FileUploader 
          isDragging={isDragging}
          isProcessing={isProcessing}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleFileInputClick}
          compact={savedMenus.length > 0}
        />
        
        <input 
          id="file-input"
          type="file" 
          accept=".json,.relationshipmenu,.pdf,application/json,application/pdf" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        
        <ErrorDisplay error={error} />
      </div>
      
      {/* Delete confirmation modal */}
      <DeleteMenuModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      
      {/* Import conflict modal */}
      <ImportConflictModal
        conflict={importConflict}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />
    </div>
  );
} 