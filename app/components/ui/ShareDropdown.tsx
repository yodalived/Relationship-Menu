import React, { useRef, useEffect, useState } from 'react';

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onExportPDF: () => void;
}

export function ShareDropdown({ isOpen, onClose, onCopyLink, onDownload, onExportPDF }: ShareDropdownProps) {
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 text-gray-500 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="dark:text-gray-200">Copy Link</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-6">Not recommended currently.</span>
              </button>
              
              <button
                onClick={() => {
                  onDownload();
                  onClose();
                }}
                className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h-6V2zm0 0v6h6z" />
                  </svg>
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