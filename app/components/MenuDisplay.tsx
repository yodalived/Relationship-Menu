'use client';

import { 
  IconMust, 
  IconLike, 
  IconMaybe, 
  IconOffLimit,
  IconNotSet,
  IconTalk
} from './icons';
import { useState, useEffect, useRef } from 'react';
import LZString from 'lz-string';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuItem, MenuData } from '../types';

interface MenuDisplayProps {
  menuData: MenuData;
  onReset: () => void;
  onSave: (updatedData: MenuData) => void;
}

// Available icon options for picker
const ICON_OPTIONS = [
  { value: 'must', label: 'Must have', icon: IconMust, bgColor: 'bg-[#DEF0FF]' },
  { value: 'like', label: 'Would like', icon: IconLike, bgColor: 'bg-[#E6F7EC]' },
  { value: 'maybe', label: 'Maybe', icon: IconMaybe, bgColor: 'bg-[#FFF2D9]' },
  { value: 'off-limit', label: 'Off limits', icon: IconOffLimit, bgColor: 'bg-[#FFEBEB]' },
  { value: 'talk', label: 'Conversation', icon: IconTalk, bgColor: 'bg-[#F0EDFF]' },
  { value: null, label: 'Not set', icon: IconNotSet, bgColor: 'bg-[#F5F5F5]' }
];

export default function MenuDisplay({ menuData, onReset, onSave }: MenuDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<MenuData>({ ...menuData });
  const [activeIconPicker, setActiveIconPicker] = useState<{catIndex: number, itemIndex: number} | null>(null);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const { last_update, people, menu } = isEditing ? editedData : menuData;
  
  // Reference for share dropdown to handle clicks outside
  const shareDropdownRef = useRef<HTMLDivElement>(null);

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Close share dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setShareDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const renderIcon = (iconType: string | null | undefined) => {
    const className = "icon-container";
    
    switch(iconType) {
      case 'must':
        return <div className={className}><IconMust /></div>;
      case 'like':
        return <div className={className}><IconLike /></div>;
      case 'maybe':
        return <div className={className}><IconMaybe /></div>;
      case 'off-limit':
        return <div className={className}><IconOffLimit /></div>;
      case 'talk':
        return <div className={className}><IconTalk /></div>;
      default:
        return <div className={className}><IconNotSet /></div>;
    }
  };

  const getItemClassName = (iconType: string | null | undefined) => {
    if (!iconType) return 'item-not-set';
    return `item-${iconType}`;
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // When exiting edit mode, no need to explicitly save as changes were saved incrementally
      setIsEditing(false);
    } else {
      // Enter edit mode with a copy of the current data
      setEditedData({ ...menuData });
      setIsEditing(true);
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
    
    a.download = `${peopleNames}_menu_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    try {
      const currentData = isEditing ? editedData : menuData;
      
      // Compress the JSON data
      const jsonString = JSON.stringify(currentData);
      const compressedData = LZString.compressToEncodedURIComponent(jsonString);
      
      // Create the URL with the compressed data as a fragment (not a query parameter)
      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}#data=${compressedData}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      alert('Failed to create share link');
    }
  };

  const handleResetWithConfirm = () => {
    // Always show confirmation dialog when a menu is loaded
    if (window.confirm('Do you want to download your menu before uploading a different one?')) {
      handleDownload();
    }
    onReset();
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIdParts = String(active.id).split('-');
      const overIdParts = String(over.id).split('-');
      
      if (activeIdParts.length === 3 && overIdParts.length === 3) {
        const catIndex = parseInt(activeIdParts[1]);
        const fromIndex = parseInt(activeIdParts[2]);
        const toIndex = parseInt(overIdParts[2]);
        
        // Only proceed if the items are in the same category
        if (activeIdParts[1] === overIdParts[1]) {
          const updatedData = { ...editedData };
          updatedData.menu[catIndex].items = arrayMove(
            updatedData.menu[catIndex].items,
            fromIndex,
            toIndex
          );
          updatedData.last_update = new Date().toISOString();
          setEditedData(updatedData);
          onSave(updatedData);
        }
      }
    }
    
    setActiveId(null);
  };

  // Create a sortable item component
  function SortableItem({ 
    catIndex, 
    itemIndex, 
    item 
  }: { 
    catIndex: number; 
    itemIndex: number; 
    item: MenuItem 
  }) {
    const itemId = `item-${catIndex}-${itemIndex}`;
    
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: itemId,
    });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
      position: isDragging ? 'relative' : 'static',
      zIndex: isDragging ? 1 : 'auto'
    } as React.CSSProperties;

    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className={`item ${getItemClassName(item.icon)}`}
      >
        <div className="item-name">
          {isEditing ? (
            <div className="relative flex items-start flex-col w-full">
              <div className="flex w-full mb-2">
                <button 
                  type="button"
                  onClick={() => toggleIconPicker(catIndex, itemIndex)}
                  className={`flex items-center pl-2 pr-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 mr-3 ${
                    item.icon ? ICON_OPTIONS.find(opt => opt.value === item.icon)?.bgColor : 'bg-white'
                  }`}
                  aria-label="Select icon"
                >
                  {renderIcon(item.icon)}
                  <span className="text-sm text-gray-700">
                    {ICON_OPTIONS.find(opt => opt.value === item.icon)?.label || 'Not set'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemNameChange(catIndex, itemIndex, e.target.value)}
                  className="flex-grow p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-bg-color)] focus:border-transparent"
                  placeholder="Edit item title..."
                />
              </div>
              
              {activeIconPicker && 
               activeIconPicker.catIndex === catIndex && 
               activeIconPicker.itemIndex === itemIndex && (
                <div className="absolute z-10 mt-1 left-0 top-10 bg-white rounded-lg shadow-xl p-3 border border-gray-100 w-[320px]">
                  <div className="grid grid-cols-2 gap-3">
                    {ICON_OPTIONS.map((option) => {
                      return (
                        <button
                          key={option.value || 'null'}
                          onClick={() => handleIconChange(catIndex, itemIndex, option.value)}
                          className={`p-2.5 rounded-lg transition-all hover:brightness-95 active:scale-[0.98] ${option.bgColor} flex justify-start items-center`}
                        >
                          <span className="text-sm font-medium px-1.5 py-1">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {renderIcon(item.icon)}
              <span>{item.name}</span>
            </>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea 
              value={item.note || ''} 
              onChange={(e) => {
                handleNoteChange(catIndex, itemIndex, e.target.value);
                autoResizeTextarea(e.target as HTMLTextAreaElement);
              }}
              onInput={(e) => autoResizeTextarea(e.target as HTMLTextAreaElement)}
              className="w-full p-2 text-sm rounded border border-gray-300"
              placeholder="Add a note..."
              style={{ minHeight: '80px', resize: 'none', overflow: 'hidden' }}
            />
            <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50 flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => handleDeleteItem(catIndex, itemIndex)}
                className="flex items-center px-3 py-1.5 bg-white rounded-md border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                title="Delete this item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="ml-1.5 text-sm font-medium">Delete Item</span>
              </button>
              <div 
                {...attributes} 
                {...listeners}
                className="flex items-center px-3 py-1.5 bg-white rounded-md border border-gray-200 cursor-move text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors select-none"
                title="Drag to reorder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                <span className="ml-1.5 text-sm font-medium">Drag to reorder</span>
              </div>
            </div>
          </div>
        ) : (
          item.note && <div className="item-note">{item.note}</div>
        )}
      </div>
    );
  }

  // Render function for the dragging item
  function getDraggingItem(id: UniqueIdentifier) {
    if (!id) return null;
    
    const idParts = String(id).split('-');
    if (idParts.length === 3) {
      const catIndex = parseInt(idParts[1]);
      const itemIndex = parseInt(idParts[2]);
      
      if (menu[catIndex] && menu[catIndex].items[itemIndex]) {
        const item = menu[catIndex].items[itemIndex];
        return (
          <div className={`item ${getItemClassName(item.icon)} w-[80%] opacity-60 shadow-lg`}>
            <div className="item-name">
              {renderIcon(item.icon)}
              <span>{item.name}</span>
            </div>
            {item.note && <div className="item-note">{item.note}</div>}
          </div>
        );
      }
    }
    
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="menu-header">
          {isEditing ? (
            <div className="flex flex-col">
              <h2 className="text-xl font-bold mb-2">Menu for:</h2>
              <div className="space-y-2">
                {people.map((personName, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => handlePersonNameChange(index, e.target.value)}
                      className="p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-bg-color)] focus:border-transparent"
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
            <h2>Menu for {formatPeople(people)}</h2>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
          <div className="text-sm text-gray-600 text-right">
            <p>Last updated: {formatDate(last_update)}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={handleToggleEdit}
              className="px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium min-w-[100px] flex items-center justify-center"
              title={isEditing ? "Exit edit mode" : "Edit this menu"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {isEditing ? 'Done' : 'Edit Menu'}
            </button>
            
            <div className="relative" ref={shareDropdownRef}>
              <button
                onClick={toggleShareDropdown}
                className="px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium min-w-[100px] flex items-center justify-center"
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
              
              {shareDropdownOpen && (
                <div className="absolute right-0 z-10 mt-1 bg-white rounded-lg shadow-xl p-2 border border-gray-100 w-[220px]">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        handleCopyLink();
                        setShareDropdownOpen(false);
                      }}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => {
                        handleDownload();
                        setShareDropdownOpen(false);
                      }}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleResetWithConfirm}
              className="px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium min-w-[100px] flex items-center justify-center"
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
              {isEditing ? (
                <div className="flex items-center w-full justify-between">
                  <div className="flex-grow px-3">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                      className="w-full bg-transparent text-white text-center font-bold focus:outline-none border-b border-white border-dashed hover:border-solid focus:border-solid placeholder-white/70"
                      placeholder="Edit section title..."
                    />
                  </div>
                  <div className="flex items-center mr-2">
                    <button
                      type="button"
                      onClick={() => handleMoveSectionUp(catIndex)}
                      disabled={catIndex === 0}
                      className={`p-1 mx-0.5 text-white ${catIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
                      title="Move section left"
                      aria-label="Move section left (or up on small screens)"
                    >
                      {/* Left arrow for larger screens, Up arrow for mobile */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSectionDown(catIndex)}
                      disabled={catIndex === menu.length - 1}
                      className={`p-1 mx-0.5 text-white ${catIndex === menu.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
                      title="Move section right"
                      aria-label="Move section right (or down on small screens)"
                    >
                      {/* Right arrow for larger screens, Down arrow for mobile */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(catIndex)}
                      className="p-1 mx-0.5 text-white border border-white/30 rounded hover:bg-red-400/70 hover:border-red-300"
                      title="Delete this section"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                category.name
              )}
            </div>
            <div>
              {isEditing ? (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={category.items.map((_, idx) => `item-${catIndex}-${idx}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {category.items.map((item, itemIndex) => (
                      <SortableItem 
                        key={`item-${catIndex}-${itemIndex}`}
                        catIndex={catIndex}
                        itemIndex={itemIndex}
                        item={item}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? getDraggingItem(activeId) : null}
                  </DragOverlay>
                </DndContext>
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
              
              {isEditing && (
                <div className="px-4 mt-6 mb-2">
                  <button
                    type="button"
                    onClick={() => handleAddItem(catIndex)}
                    className="w-full py-3 border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center bg-white/50 hover:bg-white"
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
      
      {isEditing && (
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
    </div>
  );
} 