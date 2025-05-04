import { MenuData, MenuMode } from '../../../types';

export type UIHandlerProps = {
  menuData: MenuData;
  setEditedData: (data: MenuData) => void;
  setMode: (mode: MenuMode) => void;
  setActiveIconPicker: (picker: { catIndex: number; itemIndex: number } | null) => void;
  activeIconPicker: { catIndex: number; itemIndex: number } | null;
};

/**
 * Creates handlers for UI interactions
 */
export function createUIHandlers({
  menuData,
  setEditedData,
  setMode,
  setActiveIconPicker,
  activeIconPicker,
}: UIHandlerProps) {
  /**
   * Change the editing mode
   */
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

  /**
   * Toggle the icon picker
   */
  const toggleIconPicker = (catIndex: number, itemIndex: number) => {
    if (activeIconPicker && 
        activeIconPicker.catIndex === catIndex && 
        activeIconPicker.itemIndex === itemIndex) {
      setActiveIconPicker(null); // Close if already open
    } else {
      setActiveIconPicker({ catIndex, itemIndex }); // Open for this item
    }
  };

  /**
   * Auto-resize a textarea to fit its content
   */
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    if (element) {
      // Reset height temporarily to get the correct scrollHeight
      element.style.height = 'auto';
      // Set the height to scrollHeight to fit all content
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  return {
    handleModeChange,
    toggleIconPicker,
    autoResizeTextarea
  };
} 