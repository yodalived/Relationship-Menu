'use client';

import { useState, useEffect } from 'react';
import LZString from 'lz-string';
import { MenuData, MenuMode } from '../types';
import { renderIcon } from './ui/IconPicker';
import { SortableMenuItem, getItemClassName } from './SortableMenuItem';
import { CategoryHeader } from './CategoryHeader';
import { Toast } from './ui/Toast';
import { ShareDropdown } from './ui/ShareDropdown';
import { ConfirmModal } from './ui/ConfirmModal';
import { generateMenuPDF } from '../utils/pdf';

interface MenuDisplayProps {
  menuData: MenuData;
  onReset: () => void;
  onSave: (updatedData: MenuData) => void;
}

export default function MenuDisplay({ menuData, onReset, onSave }: MenuDisplayProps) {
  const [mode, setMode] = useState<MenuMode>('view');
  const [editedData, setEditedData] = useState<MenuData>({ ...menuData });
  const [activeIconPicker, setActiveIconPicker] = useState<{catIndex: number, itemIndex: number} | null>(null);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const isEditing = mode === 'edit' || mode === 'fill';
  const { last_update, people, menu } = isEditing ? editedData : menuData;
  
  const formatPeople = (people: string[]) => {
    if (people.length === 0) return "";
    if (people.length === 1) return people[0];
    if (people.length === 2) return `${people[0]} and ${people[1]}`;
    return `${people.slice(0, -1).join(', ')}, and ${people[people.length - 1]}`;
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleModeChange = (newMode: MenuMode) => {
    if (newMode === 'view') {
      // When exiting edit/fill mode, no need to explicitly save as changes were saved incrementally
      setMode('view');
    } else {
      // Enter edit/fill mode with a copy of the current data
      setEditedData({ ...menuData });
      setMode(newMode);
    }
  };

  const handleNoteChange = (catIndex: number, itemIndex: number, newNote: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].note = newNote || null;
    updatedData.last_update = new Date().toISOString(); // Update timestamp on every change
    setEditedData(updatedData);
    onSave(updatedData); // Save immediately
  };

  // Auto-resize textarea function
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    if (element) {
      // Reset height temporarily to get the correct scrollHeight
      element.style.height = 'auto';
      // Set the height to scrollHeight to fit all content
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  // Effect to resize all textareas when entering edit mode
  useEffect(() => {
    if (isEditing) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          autoResizeTextarea(textarea);
        });
      }, 0);
    }
  }, [isEditing]);

  const handleIconChange = (catIndex: number, itemIndex: number, newIcon: string | null) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].icon = newIcon;
    updatedData.last_update = new Date().toISOString(); // Update timestamp on every change
    setEditedData(updatedData);
    onSave(updatedData); // Save immediately
    setActiveIconPicker(null); // Close the picker after selection
  };

  const handleCategoryNameChange = (catIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].name = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handlePersonNameChange = (personIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.people[personIndex] = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleItemNameChange = (catIndex: number, itemIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].name = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleAddPerson = () => {
    const updatedData = { ...editedData };
    updatedData.people.push("New Person");
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleDeletePerson = (personIndex: number) => {
    const updatedData = { ...editedData };
    // Ensure we maintain at least 2 people
    if (updatedData.people.length <= 2) {
      alert("A relationship menu must have at least 2 people.");
      return;
    }
    updatedData.people.splice(personIndex, 1);
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const toggleIconPicker = (catIndex: number, itemIndex: number) => {
    if (activeIconPicker && 
        activeIconPicker.catIndex === catIndex && 
        activeIconPicker.itemIndex === itemIndex) {
      setActiveIconPicker(null); // Close if already open
    } else {
      setActiveIconPicker({ catIndex, itemIndex }); // Open for this item
    }
  };

  const handleDownload = () => {
    // Create a blob with the JSON data
    const jsonString = JSON.stringify(isEditing ? editedData : menuData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename from people's names
    const peopleNames = people.length > 0 ? 
      people.join('_').replace(/\s+/g, '_') : 
      'relationship_menu';
    
    a.download = `${peopleNames}_menu_${new Date().toISOString().split('T')[0]}.relationshipmenu`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportPDF = () => {
    try {
      // Get the current menu data
      const currentData = isEditing ? editedData : menuData;
      
      // Generate the PDF file
      const pdfBlob = generateMenuPDF(currentData);
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // Create filename from people's names
      const peopleNames = people.length > 0 ? 
        people.join('_').replace(/\s+/g, '_') : 
        'relationship_menu';
      
      a.download = `${peopleNames}_menu_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotification('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showNotification('Failed to export PDF');
    }
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleCopyLink = () => {
    try {
      const currentData = isEditing ? editedData : menuData;
      
      // Compress the JSON data
      const jsonString = JSON.stringify(currentData);
      const compressedData = LZString.compressToEncodedURIComponent(jsonString);
      
      // Manually replace any + with %2B to ensure compatibility with messaging apps
      const safeCompressedData = compressedData.replace(/\+/g, '%2B');
      
      // Create the URL with the compressed data as a fragment (not a query parameter)
      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}#data_v1=${safeCompressedData}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        showNotification('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link copied to clipboard!');
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      showNotification('Failed to create share link');
    }
  };

  const handleResetWithConfirm = () => {
    setConfirmModalOpen(true);
  };

  const handleResetConfirmed = (shouldDownload: boolean) => {
    if (shouldDownload) {
      handleDownload();
    }
    onReset();
    setConfirmModalOpen(false);
  };

  // Toggle share dropdown
  const toggleShareDropdown = () => {
    setShareDropdownOpen(!shareDropdownOpen);
  };

  const handleDeleteItem = (catIndex: number, itemIndex: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedData = { ...editedData };
      updatedData.menu[catIndex].items.splice(itemIndex, 1);
      updatedData.last_update = new Date().toISOString();
      setEditedData(updatedData);
      onSave(updatedData);
    }
  };

  const handleAddItem = (catIndex: number) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items.push({
      name: "New Item",
      icon: null,
      note: null
    });
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleAddSection = () => {
    const updatedData = { ...editedData };
    updatedData.menu.push({
      name: "New Section",
      items: []
    });
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleDeleteSection = (catIndex: number) => {
    if (window.confirm("Are you sure you want to delete this entire section and all items in it?")) {
      const updatedData = { ...editedData };
      updatedData.menu.splice(catIndex, 1);
      updatedData.last_update = new Date().toISOString();
      setEditedData(updatedData);
      onSave(updatedData);
    }
  };

  const handleMoveSectionUp = (catIndex: number) => {
    if (catIndex === 0) return; // Already at the top/leftmost
    
    const updatedData = { ...editedData };
    const temp = updatedData.menu[catIndex];
    updatedData.menu[catIndex] = updatedData.menu[catIndex - 1];
    updatedData.menu[catIndex - 1] = temp;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleMoveSectionDown = (catIndex: number) => {
    if (catIndex === menu.length - 1) return; // Already at the bottom/rightmost
    
    const updatedData = { ...editedData };
    const temp = updatedData.menu[catIndex];
    updatedData.menu[catIndex] = updatedData.menu[catIndex + 1];
    updatedData.menu[catIndex + 1] = temp;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  // Functions to handle item movement - add after handleMoveSectionDown
  const handleMoveItemUp = (catIndex: number, itemIndex: number) => {
    if (itemIndex === 0) return; // Already at the top
    
    const updatedData = { ...editedData };
    const temp = updatedData.menu[catIndex].items[itemIndex];
    updatedData.menu[catIndex].items[itemIndex] = updatedData.menu[catIndex].items[itemIndex - 1];
    updatedData.menu[catIndex].items[itemIndex - 1] = temp;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  const handleMoveItemDown = (catIndex: number, itemIndex: number) => {
    if (itemIndex === menu[catIndex].items.length - 1) return; // Already at the bottom
    
    const updatedData = { ...editedData };
    const temp = updatedData.menu[catIndex].items[itemIndex];
    updatedData.menu[catIndex].items[itemIndex] = updatedData.menu[catIndex].items[itemIndex + 1];
    updatedData.menu[catIndex].items[itemIndex + 1] = temp;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  return (
    <div>
      {/* Toast notification */}
      <Toast isVisible={showToast} message={toastMessage} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-auto">
          <div className="menu-header w-full">
            {mode === 'edit' ? (
              <div className="flex flex-col">
                <h2 className="text-xl font-bold mb-2">Menu for:</h2>
                <div className="space-y-2">
                  {people.map((personName, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={personName}
                        onChange={(e) => handlePersonNameChange(index, e.target.value)}
                        className="p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-text-color)] focus:border-transparent"
                        placeholder="Person name"
                      />
                      {people.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleDeletePerson(index)}
                          className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors"
                          title="Remove person"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="mt-2 flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Person
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="truncate max-w-[calc(100vw-20px)] md:max-w-none mb-0 text-[var(--main-text-color)] dark:text-white text-2xl">Menu for {formatPeople(people)}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Last updated: {formatDate(last_update)}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full md:w-auto md:flex-row items-end md:items-center gap-2 md:gap-4">
          <div className="flex gap-2 flex-wrap justify-end w-full md:w-auto">
            {/* Segmented control for View/Fill/Edit modes */}
            <div className="flex rounded-md shadow-sm bg-[var(--main-text-color)] dark:bg-[var(--main-text-color)] p-1 min-w-[240px] w-full md:w-auto">
              <button
                onClick={() => handleModeChange('view')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'view' 
                    ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
                    : 'text-white hover:bg-[var(--main-text-color-hover)]'
                }`}
              >
                View
              </button>
              <button
                onClick={() => handleModeChange('fill')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'fill' 
                    ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
                    : 'text-white hover:bg-[var(--main-text-color-hover)]'
                }`}
              >
                Fill
              </button>
              <button
                onClick={() => handleModeChange('edit')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === 'edit' 
                    ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
                    : 'text-white hover:bg-[var(--main-text-color-hover)]'
                }`}
              >
                Edit
              </button>
            </div>
            
            <div className="relative flex-grow md:flex-grow-0">
              <button
                onClick={toggleShareDropdown}
                className="h-full px-3 md:px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium w-full md:w-auto min-w-[100px] flex items-center justify-center"
                title="Share this menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <ShareDropdown 
                isOpen={shareDropdownOpen}
                onClose={() => setShareDropdownOpen(false)}
                onCopyLink={handleCopyLink}
                onDownload={handleDownload}
                onExportPDF={handleExportPDF}
              />
            </div>
            
            <button
              onClick={handleResetWithConfirm}
              className="px-3 md:px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium flex-grow md:flex-grow-0 min-w-[100px] flex items-center justify-center"
              title="Create a new menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Menu
            </button>
          </div>
        </div>
      </div>

      <div className="content">
        {menu.map((category, catIndex) => (
          <div key={catIndex} className="category">
            <div className="title">
              <CategoryHeader 
                name={category.name}
                catIndex={catIndex}
                isEditing={mode === 'edit'}
                totalCategories={menu.length}
                onNameChange={handleCategoryNameChange}
                onMoveUp={handleMoveSectionUp}
                onMoveDown={handleMoveSectionDown}
                onDelete={handleDeleteSection}
              />
            </div>
            <div>
              {mode === 'edit' ? (
                category.items.map((item, itemIndex) => (
                  <SortableMenuItem 
                    key={`item-${catIndex}-${itemIndex}`}
                    catIndex={catIndex}
                    itemIndex={itemIndex}
                    item={item}
                    isEditing={true}
                    activeIconPicker={activeIconPicker}
                    onToggleIconPicker={toggleIconPicker}
                    onIconChange={handleIconChange}
                    onItemNameChange={handleItemNameChange}
                    onNoteChange={handleNoteChange}
                    onDeleteItem={handleDeleteItem}
                    onMoveItemUp={handleMoveItemUp}
                    onMoveItemDown={handleMoveItemDown}
                    autoResizeTextarea={autoResizeTextarea}
                    editMode={mode}
                    itemCount={category.items.length}
                  />
                ))
              ) : mode === 'fill' ? (
                category.items.map((item, itemIndex) => (
                  <SortableMenuItem 
                    key={`item-${catIndex}-${itemIndex}`}
                    catIndex={catIndex}
                    itemIndex={itemIndex}
                    item={item}
                    isEditing={true}
                    activeIconPicker={activeIconPicker}
                    onToggleIconPicker={toggleIconPicker}
                    onIconChange={handleIconChange}
                    onItemNameChange={handleItemNameChange}
                    onNoteChange={handleNoteChange}
                    onDeleteItem={handleDeleteItem}
                    onMoveItemUp={handleMoveItemUp}
                    onMoveItemDown={handleMoveItemDown}
                    autoResizeTextarea={autoResizeTextarea}
                    editMode={mode}
                  />
                ))
              ) : (
                category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={`item ${getItemClassName(item.icon)}`}>
                    <div className="item-name">
                      {renderIcon(item.icon)}
                      <span>{item.name}</span>
                    </div>
                    {item.note && <div className="item-note">{item.note}</div>}
                  </div>
                ))
              )}
              
              {mode === 'edit' && (
                <div className="px-4 mt-6 mb-2">
                  <button
                    type="button"
                    onClick={() => handleAddItem(catIndex)}
                    className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Item
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {mode === 'edit' && (
        <div className="my-8 flex justify-center">
          <button
            type="button"
            onClick={handleAddSection}
            className="w-[80%] max-w-md py-4 px-3 border-2 border-dashed border-[var(--main-bg-color)] rounded-lg bg-[var(--main-bg-color)]/10 text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] hover:border-[var(--main-text-color)] hover:bg-[var(--main-bg-color)]/20 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Add New Section
          </button>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          This menu is saved in your browser and will be restored when you visit again.
          {isEditing && ' Changes are automatically saved as you type.'}
        </p>
      </div>
      
      {/* Confirmation Modal for New Menu */}
      <ConfirmModal 
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleResetConfirmed}
        title="Create new menu?"
        message="Would you like to download your current menu?"
      />
    </div>
  );
} 