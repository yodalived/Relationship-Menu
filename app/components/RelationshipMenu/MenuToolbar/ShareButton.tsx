import React from 'react';
import { ShareDropdown } from './ShareDropdown';

interface ShareButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onCopyLink: () => void;
  onJSONDownload: () => void;
  onExportPDF: () => void;
}

export function ShareButton({
  isOpen,
  onToggle,
  onCopyLink,
  onJSONDownload,
  onExportPDF
}: ShareButtonProps) {
  return (
    <div className="relative flex-grow md:flex-grow-0">
      <button
        onClick={onToggle}
        className="h-full px-3 md:px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium w-full md:w-auto min-w-[100px] flex items-center justify-center"
        title="Share this menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <ShareDropdown 
        isOpen={isOpen}
        onClose={onToggle}
        onCopyLink={onCopyLink}
        onJSONDownload={onJSONDownload}
        onExportPDF={onExportPDF}
      />
    </div>
  );
} 