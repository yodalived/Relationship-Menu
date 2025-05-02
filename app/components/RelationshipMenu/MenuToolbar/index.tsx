import React from 'react';
import { MenuMode } from '../../../types';
import { ModeSelector } from './ModeSelector';
import { ShareButton } from './ShareButton';
import { NewButton } from './NewButton';

interface MenuToolbarProps {
  mode: MenuMode;
  onModeChange: (mode: MenuMode) => void;
  shareDropdownOpen: boolean;
  toggleShareDropdown: () => void;
  onCopyLink: () => void;
  onJSONDownload: () => void;
  onExportPDF: () => void;
  onReset: () => void;
}

export function MenuToolbar({
  mode,
  onModeChange,
  shareDropdownOpen,
  toggleShareDropdown,
  onCopyLink,
  onJSONDownload,
  onExportPDF,
  onReset
}: MenuToolbarProps) {
  return (
    <div className="flex flex-col w-full md:w-auto md:flex-row items-end md:items-center gap-2 md:gap-6">
      <div className="flex gap-2 md:gap-4 flex-wrap justify-end w-full md:w-auto">
        {/* Mode Selector Component */}
        <ModeSelector 
          currentMode={mode} 
          onModeChange={onModeChange} 
        />
        
        {/* Share Button Component */}
        <ShareButton 
          isOpen={shareDropdownOpen}
          onToggle={toggleShareDropdown}
          onCopyLink={onCopyLink}
          onJSONDownload={onJSONDownload}
          onExportPDF={onExportPDF}
        />
        
        {/* New Menu Button Component */}
        <NewButton onClick={onReset} />
      </div>
    </div>
  );
}

// Export individual components for direct use if needed
export { ModeSelector } from './ModeSelector';
export { ShareButton } from './ShareButton';
export { NewButton } from './NewButton'; 