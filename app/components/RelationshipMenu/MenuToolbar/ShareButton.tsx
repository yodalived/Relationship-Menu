import React from 'react';
import { ShareDropdown } from './ShareDropdown';
import { IconShare, IconChevron } from '../../icons';

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
        <IconShare className="h-4 w-4 mr-1" />
        Share
        <IconChevron direction="down" className="h-4 w-4 ml-1" />
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