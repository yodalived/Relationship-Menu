import React, { useState, useRef, useEffect } from 'react';
import { IconPlus, IconFile, IconChevron, IconArrowLeft } from '../../icons';
import { TemplateSelector } from '../../TemplateSelector';
import { FileSelector } from '../../FileSelector';

export function MenuButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNewMenu = () => {
    setIsDropdownOpen(false);
    setShowFileModal(false);
    setShowTemplateModal(true);
  };

  const handleOpenExisting = () => {
    setIsDropdownOpen(false);
    setShowTemplateModal(false);
    setShowFileModal(true);
  };

  const handleCloseMenu = () => {
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showTemplateModal || showFileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTemplateModal, showFileModal]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full px-3 md:px-4 py-3 bg-[rgba(148,188,194,0.15)] dark:bg-[rgba(79,139,149,0.15)] text-[var(--main-text-color)] rounded-md hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)] transition-colors shadow-md text-sm font-medium flex items-center justify-center border border-[var(--main-text-color)] whitespace-nowrap"
        title="File menu options"
      >
        <IconFile className="h-4 w-4 mr-1" />
        Menu
        <IconChevron 
          direction={isDropdownOpen ? 'up' : 'down'} 
          className="h-4 w-4 ml-1" 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <button
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              onClick={handleNewMenu}
            >
              <IconPlus className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
              New Menu
            </button>
            <button
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              onClick={handleOpenExisting}
            >
              <IconFile className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
              Open Existing
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              onClick={handleCloseMenu}
            >
              <IconArrowLeft className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Template Selection Modal using the component's built-in modal capability */}
      {showTemplateModal && (
        <TemplateSelector 
          isModal={true}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {/* File Selection Modal using the component's built-in modal capability */}
      {showFileModal && (
        <FileSelector 
          isModal={true} 
          onClose={() => setShowFileModal(false)}
        />
      )}
    </div>
  );
} 