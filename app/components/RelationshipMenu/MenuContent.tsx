import React from 'react';
import { MenuCategory, MenuItem as MenuItemType, MenuMode } from '../../types';
import { MenuItem } from './MenuItem';
import { CategoryHeader } from './CategoryHeader';

interface MenuContentProps {
  menu: MenuCategory[];
  mode: MenuMode;
  activeIconPicker: { catIndex: number, itemIndex: number } | null;
  onToggleIconPicker: (catIndex: number, itemIndex: number) => void;
  onIconChange: (catIndex: number, itemIndex: number, newIcon: string | null) => void;
  onCategoryNameChange: (catIndex: number, newName: string) => void;
  onItemNameChange: (catIndex: number, itemIndex: number, newName: string) => void;
  onNoteChange: (catIndex: number, itemIndex: number, newNote: string) => void;
  onDeleteItem: (catIndex: number, itemIndex: number) => void;
  onAddItem: (catIndex: number) => void;
  onAddSection: () => void;
  onDeleteSection: (catIndex: number) => void;
  onMoveSectionUp: (catIndex: number) => void;
  onMoveSectionDown: (catIndex: number) => void;
  onMoveItemUp: (catIndex: number, itemIndex: number) => void;
  onMoveItemDown: (catIndex: number, itemIndex: number) => void;
  autoResizeTextarea: (element: HTMLTextAreaElement) => void;
}

export function MenuContent({
  menu,
  mode,
  activeIconPicker,
  onToggleIconPicker,
  onIconChange,
  onCategoryNameChange,
  onItemNameChange,
  onNoteChange,
  onDeleteItem,
  onAddItem,
  onAddSection,
  onDeleteSection,
  onMoveSectionUp,
  onMoveSectionDown,
  onMoveItemUp,
  onMoveItemDown,
  autoResizeTextarea
}: MenuContentProps) {
  const isEditing = mode === 'edit';

  return (
    <>
      <div className="content">
        {menu.map((category, catIndex) => (
          <div key={catIndex} className="category">
            <div className="title">
              <CategoryHeader 
                name={category.name}
                catIndex={catIndex}
                isEditing={isEditing}
                totalCategories={menu.length}
                onNameChange={onCategoryNameChange}
                onMoveUp={onMoveSectionUp}
                onMoveDown={onMoveSectionDown}
                onDelete={onDeleteSection}
              />
            </div>
            <div>
              {/* Map over category items and render with appropriate mode */}
              {category.items.map((item: MenuItemType, itemIndex: number) => (
                <MenuItem 
                  key={`item-${catIndex}-${itemIndex}`}
                  catIndex={catIndex}
                  itemIndex={itemIndex}
                  item={item}
                  mode={mode}
                  activeIconPicker={activeIconPicker}
                  onToggleIconPicker={onToggleIconPicker}
                  onIconChange={onIconChange}
                  onItemNameChange={onItemNameChange}
                  onNoteChange={onNoteChange}
                  onDeleteItem={onDeleteItem}
                  onMoveItemUp={onMoveItemUp}
                  onMoveItemDown={onMoveItemDown}
                  autoResizeTextarea={autoResizeTextarea}
                  itemCount={category.items.length}
                />
              ))}
              
              {/* Add Item button (only in edit mode) */}
              {isEditing && (
                <div className="px-4 mt-6 mb-2">
                  <button
                    type="button"
                    onClick={() => onAddItem(catIndex)}
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
      
      {/* Add Section button (only in edit mode) */}
      {isEditing && (
        <div className="my-8 flex justify-center">
          <button
            type="button"
            onClick={onAddSection}
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
          {(mode === 'edit' || mode === 'fill') && ' Changes are automatically saved as you type.'}
        </p>
      </div>
    </>
  );
} 