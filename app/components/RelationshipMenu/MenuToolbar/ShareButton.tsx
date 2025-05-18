import React, { useState, useRef, useEffect } from 'react';
import { IconShare, IconChevron, IconFile, IconDownload } from '../../icons';

interface ShareButtonProps {
  onJSONDownload: () => void;
  onExportPDF: () => void;
}

export function ShareButton({
  onJSONDownload,
  onExportPDF
}: ShareButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{left: string | number, right: string | number}>({ left: 'auto', right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      calculateDropdownPosition();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 280; // w-[280px]
      
      // Force right-aligned positioning on small/medium screens
      if (viewportWidth < 768) {
        setDropdownPosition({ left: 'auto', right: 0 });
        return;
      }
      
      // On larger screens, check if dropdown would extend beyond right edge
      if (buttonRect.right + dropdownWidth > viewportWidth) {
        if (buttonRect.left - dropdownWidth >= 0) {
          setDropdownPosition({ left: 'auto', right: 0 });
        } else {
          // Calculate position to center dropdown under button
          const rightSpace = viewportWidth - buttonRect.right;
          const leftSpace = buttonRect.left;
          const buttonCenter = buttonRect.width / 2;
          const dropdownCenter = dropdownWidth / 2;
          
          // Position so dropdown stays in viewport
          setDropdownPosition({ 
            left: Math.max(-leftSpace, Math.min(rightSpace - dropdownWidth, buttonCenter - dropdownCenter)), 
            right: 'auto' 
          });
        }
      } else {
        // Default right alignment
        setDropdownPosition({ left: 'auto', right: 0 });
      }
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isDropdownOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="w-full px-3 md:px-4 py-3 bg-[rgba(148,188,194,0.15)] dark:bg-[rgba(79,139,149,0.15)] text-[var(--main-text-color)] rounded-md hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)] transition-colors shadow-md text-sm font-medium flex items-center justify-center border border-[var(--main-text-color)] whitespace-nowrap"
        title="Share this menu"
        data-onboarding="share-button"
      >
        <IconShare className="h-4 w-4 mr-1" />
        Share
        <IconChevron direction={isDropdownOpen ? "up" : "down"} className="h-4 w-4 ml-1" />
      </button>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          className="absolute mt-2 w-[280px] bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
          style={{ left: dropdownPosition.left, right: dropdownPosition.right }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onExportPDF();
                setIsDropdownOpen(false);
              }}
              className="flex flex-col px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              <div className="flex items-center">
                <IconDownload className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
                <span>Download PDF</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">Can be edited on the website.</span>
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <span className="font-medium">Advanced</span>
              <IconChevron
                direction={advancedOpen ? "up" : "down"}
                className="h-4 w-4 text-gray-500"
              />
            </button>
            
            {advancedOpen && (
              <div className="pl-2">
                <button
                  onClick={() => {
                    onJSONDownload();
                    setIsDropdownOpen(false);
                  }}
                  className="flex flex-col px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <div className="flex items-center">
                    <IconFile className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
                    <span>Download as JSON</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">For the nerds among us.</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 