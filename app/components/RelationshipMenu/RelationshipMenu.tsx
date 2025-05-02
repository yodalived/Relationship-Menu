import React, { useState, useEffect, useMemo } from 'react';
import { MenuData, MenuMode } from '../../types';
import { MenuHeader } from './MenuHeader';
import { MenuToolbar } from './MenuToolbar';
import { MenuContent } from './MenuContent';
import { useToast } from '../ui/Toast';
import { ConfirmModal } from '../ui/ConfirmModal';
import {
  createDataHandlers,
  createItemHandlers,
  createUIHandlers,
  createExportHandlers
} from './handlers';

interface RelationshipMenuProps {
  menuData: MenuData;
  onReset: () => void;
  onSave: (updatedData: MenuData) => void;
  initialMode?: MenuMode;
}

export function RelationshipMenu({ menuData, onReset, onSave, initialMode = 'view' }: RelationshipMenuProps) {
  // State for menu operation
  const [mode, setMode] = useState<MenuMode>(initialMode);
  const [editedData, setEditedData] = useState<MenuData>({ ...menuData });
  const [activeIconPicker, setActiveIconPicker] = useState<{catIndex: number, itemIndex: number} | null>(null);
  
  // UI state
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  
  // Get the toast utility from context
  const { showToast } = useToast();
  
  // Derived state
  const isEditing = mode === 'edit' || mode === 'fill';
  const { last_update, people, menu } = isEditing ? editedData : menuData;

  // Auto-resize textarea utility function
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  // Create export handlers first
  const {
    handleJSONDownload,
    handleExportPDF,
    handleCopyLink
  } = useMemo(() => createExportHandlers({
    menuData,
    editedData,
    isEditing,
    showToast: showToast
  }), [menuData, editedData, isEditing, showToast]);

  // Create UI handlers with the now-available handleExportPDF
  const {
    handleModeChange,
    toggleIconPicker,
    handleResetWithConfirm,
    handleResetConfirmed
  } = useMemo(() => createUIHandlers({
    menuData,
    setEditedData,
    setMode,
    setActiveIconPicker,
    activeIconPicker,
    setConfirmModalOpen,
    handleExportPDF,
    onReset
  }), [menuData, activeIconPicker, onReset, handleExportPDF]);

  // Create data handlers
  const {
    handleNoteChange,
    handleIconChange,
    handleCategoryNameChange,
    handlePersonNameChange,
    handleItemNameChange,
    handleAddPerson,
    handleDeletePerson
  } = useMemo(() => createDataHandlers({
    editedData,
    setEditedData,
    onSave,
    setActiveIconPicker
  }), [editedData, onSave]);

  // Create item handlers
  const {
    handleDeleteItem,
    handleAddItem,
    handleAddSection,
    handleDeleteSection,
    handleMoveSectionUp,
    handleMoveSectionDown,
    handleMoveItemUp,
    handleMoveItemDown
  } = useMemo(() => createItemHandlers({
    editedData,
    setEditedData,
    onSave,
    menu
  }), [editedData, onSave, menu]);

  const toggleShareDropdown = () => {
    setShareDropdownOpen(!shareDropdownOpen);
  };

  // Effect to resize all textareas when entering edit mode
  useEffect(() => {
    if (isEditing) {
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          autoResizeTextarea(textarea as HTMLTextAreaElement);
        });
      }, 0);
    }
  }, [isEditing]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Menu Header Component */}
        <MenuHeader 
          mode={mode}
          people={people}
          lastUpdate={last_update}
          onPersonNameChange={handlePersonNameChange}
          onAddPerson={handleAddPerson}
          onDeletePerson={handleDeletePerson}
        />
        
        {/* Menu Toolbar Component */}
        <MenuToolbar 
          mode={mode}
          onModeChange={handleModeChange}
          shareDropdownOpen={shareDropdownOpen}
          toggleShareDropdown={toggleShareDropdown}
          onCopyLink={handleCopyLink}
          onJSONDownload={handleJSONDownload}
          onExportPDF={handleExportPDF}
          onReset={handleResetWithConfirm}
        />
      </div>

      {/* Menu Content Component */}
      <MenuContent 
        menu={menu}
        mode={mode}
        activeIconPicker={activeIconPicker}
        onToggleIconPicker={toggleIconPicker}
        onIconChange={handleIconChange}
        onCategoryNameChange={handleCategoryNameChange}
        onItemNameChange={handleItemNameChange}
        onNoteChange={handleNoteChange}
        onDeleteItem={handleDeleteItem}
        onAddItem={handleAddItem}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onMoveSectionUp={handleMoveSectionUp}
        onMoveSectionDown={handleMoveSectionDown}
        onMoveItemUp={handleMoveItemUp}
        onMoveItemDown={handleMoveItemDown}
        autoResizeTextarea={autoResizeTextarea}
      />
      
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