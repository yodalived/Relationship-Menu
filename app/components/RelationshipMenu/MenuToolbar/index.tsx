import React from 'react';
import { MenuMode } from '../../../types';
import { ModeSelector } from './ModeSelector';
import { ShareButton } from './ShareButton';
import { MenuButton } from './MenuButton';

interface MenuToolbarProps {
  mode: MenuMode;
  onModeChange: (mode: MenuMode) => void;
  shareDropdownOpen: boolean;
  toggleShareDropdown: () => void;
  onCopyLink: () => void;
  onJSONDownload: () => void;
  onExportPDF: () => void;
}

export function MenuToolbar({
  mode,
  onModeChange,
  shareDropdownOpen,
  toggleShareDropdown,
  onCopyLink,
  onJSONDownload,
  onExportPDF,
}: MenuToolbarProps) {
  return (
    <div className="flex flex-col w-full md:w-auto gap-3">
      {/* Mode Selector Component - Full width on all screens */}
      <div className="w-full">
        <ModeSelector 
          currentMode={mode} 
          onModeChange={onModeChange} 
        />
      </div>
      
      {/* Action Buttons Row */}
      <div className="flex gap-2 justify-end">
        {/* Share Button Component */}
        <ShareButton 
          isOpen={shareDropdownOpen}
          onToggle={toggleShareDropdown}
          onCopyLink={onCopyLink}
          onJSONDownload={onJSONDownload}
          onExportPDF={onExportPDF}
        />
        
        {/* New Menu Button Component */}
        <MenuButton />
      </div>
    </div>
  );
}

// Export individual components for direct use if needed
export { ModeSelector } from './ModeSelector';
export { ShareButton } from './ShareButton';
export { MenuButton } from './MenuButton'; 