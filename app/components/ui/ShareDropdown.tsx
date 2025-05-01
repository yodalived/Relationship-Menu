import React, { useRef, useEffect } from 'react';

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onExportPDF: () => void;
}

export function ShareDropdown({ isOpen, onClose, onCopyLink, onDownload, onExportPDF }: ShareDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            onCopyLink();
            onClose();
          }}
          className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="dark:text-gray-200">Copy Link</span>
        </button>
        <button
          onClick={() => {
            onDownload();
            onClose();
          }}
          className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="dark:text-gray-200">Download as JSON</span>
        </button>
        <button
          onClick={() => {
            onExportPDF();
            onClose();
          }}
          className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h-6V2zm0 0v6h6z" />
          </svg>
          <span className="dark:text-gray-200">Export as PDF</span>
        </button>
      </div>
    </div>
  );
} 