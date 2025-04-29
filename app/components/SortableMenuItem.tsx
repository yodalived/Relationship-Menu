import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MenuItem } from '../types';
import { IconButton, IconPicker, renderIcon } from './ui/IconPicker';

interface SortableItemProps {
  catIndex: number;
  itemIndex: number;
  item: MenuItem;
  isEditing: boolean;
  activeIconPicker: { catIndex: number, itemIndex: number } | null;
  onToggleIconPicker: (catIndex: number, itemIndex: number) => void;
  onIconChange: (catIndex: number, itemIndex: number, newIcon: string | null) => void;
  onItemNameChange: (catIndex: number, itemIndex: number, newName: string) => void;
  onNoteChange: (catIndex: number, itemIndex: number, newNote: string) => void;
  onDeleteItem: (catIndex: number, itemIndex: number) => void;
  autoResizeTextarea: (element: HTMLTextAreaElement) => void;
}

export function getItemClassName(iconType: string | null | undefined) {
  if (!iconType) return 'item-not-set';
  return `item-${iconType}`;
}

export function SortableMenuItem({
  catIndex,
  itemIndex,
  item,
  isEditing,
  activeIconPicker,
  onToggleIconPicker,
  onIconChange,
  onItemNameChange,
  onNoteChange,
  onDeleteItem,
  autoResizeTextarea
}: SortableItemProps) {
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

  // Convert item.icon to string | null to fix type issues
  const iconType = item.icon === undefined ? null : item.icon;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`item ${getItemClassName(item.icon)}`}
    >
      <div className="item-name">
        {isEditing ? (
          <div className="relative flex items-start flex-col w-full">
            <div className="flex flex-col sm:flex-row w-full mb-2 gap-2">
              <IconButton 
                selectedIcon={iconType}
                onClick={() => onToggleIconPicker(catIndex, itemIndex)}
              />
              
              <input
                type="text"
                value={item.name}
                onChange={(e) => onItemNameChange(catIndex, itemIndex, e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Edit item title..."
              />
            </div>
            
            <IconPicker
              selectedIcon={iconType}
              onSelectIcon={(icon) => onIconChange(catIndex, itemIndex, icon)}
              isOpen={activeIconPicker !== null && 
                     activeIconPicker.catIndex === catIndex && 
                     activeIconPicker.itemIndex === itemIndex}
            />
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
              onNoteChange(catIndex, itemIndex, e.target.value);
              autoResizeTextarea(e.target as HTMLTextAreaElement);
            }}
            onInput={(e) => autoResizeTextarea(e.target as HTMLTextAreaElement)}
            className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Add a note..."
            style={{ minHeight: '80px', resize: 'none', overflow: 'hidden' }}
          />
          <div className="mt-4 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
            <button 
              type="button" 
              onClick={() => onDeleteItem(catIndex, itemIndex)}
              className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-900 rounded-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-800 dark:hover:text-red-300 transition-colors"
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
              className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 cursor-move text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none"
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