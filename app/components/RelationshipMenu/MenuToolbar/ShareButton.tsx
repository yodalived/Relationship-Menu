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
    <div className="relative w-full">
      <button
        onClick={onToggle}
        className="w-full h-full px-3 md:px-4 py-3 bg-[rgba(148,188,194,0.15)] dark:bg-[rgba(79,139,149,0.15)] text-[var(--main-text-color)] rounded-md hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)] transition-colors shadow-md text-sm font-medium flex items-center justify-center border border-[var(--main-text-color)] whitespace-nowrap"
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