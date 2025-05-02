import React, { useRef, useEffect, useState } from 'react';
import { IconChevron, IconCopy, IconFile, IconDownload } from '../../icons';

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onJSONDownload: () => void;
  onExportPDF: () => void;
}

export function ShareDropdown({ isOpen, onClose, onCopyLink, onJSONDownload, onExportPDF }: ShareDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div ref={dropdownRef} className="absolute right-0 z-10 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 border border-gray-100 dark:border-gray-700 w-[280px]">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            onExportPDF();
            onClose();
          }}
          className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <div className="flex items-center">
            <IconDownload className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
            <span className="dark:text-gray-200">Download PDF</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">Can be edited on the website.</span>
        </button>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <span className="dark:text-gray-200 font-medium">Advanced</span>
            <IconChevron
              direction={advancedOpen ? "up" : "down"}
              className="h-4 w-4 text-gray-500 transition-transform"
            />
          </button>
          
          {advancedOpen && (
            <div className="pl-2 mt-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  onCopyLink();
                  onClose();
                }}
                className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
              >
                <div className="flex items-center">
                  <IconCopy className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
                  <span className="dark:text-gray-200">Copy Link</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">Not recommended currently.</span>
              </button>
              
              <button
                onClick={() => {
                  onJSONDownload();
                  onClose();
                }}
                className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
              >
                <div className="flex items-center">
                  <IconFile className="h-4 w-4 mr-2 text-[var(--main-text-color)]" />
                  <span className="dark:text-gray-200">Download as JSON</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">For the nerds among us.</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 