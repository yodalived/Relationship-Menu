import React from 'react';
import { MenuItem as MenuItemType, MenuMode } from '../../../types';
import { ViewMenuItem } from './ViewMenuItem';
import { EditMenuItem } from './EditMenuItem';
import { FillMenuItem } from './FillMenuItem';

interface MenuItemProps {
  catIndex: number;
  itemIndex: number;
  item: MenuItemType;
  mode: MenuMode;
  isEditing?: boolean;
  activeIconPicker: { catIndex: number, itemIndex: number } | null;
  onToggleIconPicker: (catIndex: number, itemIndex: number) => void;
  onIconChange: (catIndex: number, itemIndex: number, newIcon: string | null) => void;
  onItemNameChange: (catIndex: number, itemIndex: number, newName: string) => void;
  onNoteChange: (catIndex: number, itemIndex: number, newNote: string) => void;
  onDeleteItem: (catIndex: number, itemIndex: number) => void;
  onMoveItemUp?: (catIndex: number, itemIndex: number) => void;
  onMoveItemDown?: (catIndex: number, itemIndex: number) => void;
  autoResizeTextarea: (element: HTMLTextAreaElement) => void;
  itemCount?: number;
}

export function MenuItem({
  item,
  catIndex,
  itemIndex,
  mode,
  activeIconPicker,
  onToggleIconPicker,
  onIconChange,
  onItemNameChange,
  onNoteChange,
  onDeleteItem,
  onMoveItemUp,
  onMoveItemDown,
  autoResizeTextarea,
  itemCount
}: MenuItemProps) {
  // Render the appropriate component based on mode
  if (mode === 'view') {
    return <ViewMenuItem item={item} />;
  } else if (mode === 'edit') {
    return (
      <EditMenuItem
        catIndex={catIndex}
        itemIndex={itemIndex}
        item={item}
        activeIconPicker={activeIconPicker}
        onToggleIconPicker={onToggleIconPicker}
        onIconChange={onIconChange}
        onItemNameChange={onItemNameChange}
        onNoteChange={onNoteChange}
        onDeleteItem={onDeleteItem}
        onMoveItemUp={onMoveItemUp}
        onMoveItemDown={onMoveItemDown}
        autoResizeTextarea={autoResizeTextarea}
        itemCount={itemCount}
      />
    );
  } else {
    // Fill mode
    return (
      <FillMenuItem
        catIndex={catIndex}
        itemIndex={itemIndex}
        item={item}
        activeIconPicker={activeIconPicker}
        onToggleIconPicker={onToggleIconPicker}
        onIconChange={onIconChange}
        onNoteChange={onNoteChange}
        autoResizeTextarea={autoResizeTextarea}
      />
    );
  }
}

// Re-export the getItemClassName function
export { getItemClassName } from './utils'; 