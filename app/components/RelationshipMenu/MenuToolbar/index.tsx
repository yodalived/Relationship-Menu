import React from 'react';
import { ShareButton } from './ShareButton';
import { MenuButton } from './MenuButton';

interface MenuToolbarProps {
  onCopyLink: () => void;
  onJSONDownload: () => void;
  onExportPDF: () => void;
}

export function MenuToolbar({
  onCopyLink,
  onJSONDownload,
  onExportPDF,
}: MenuToolbarProps) {
  return (
    <div className="flex w-full md:w-auto gap-2 justify-end">
      {/* New Menu Button Component - 50% width on small screens */}
      <div className="w-1/2 md:w-auto">
        <MenuButton />
      </div>
      
      {/* Share Button Component - 50% width on small screens */}
      <div className="w-1/2 md:w-auto">
        <ShareButton 
          onCopyLink={onCopyLink}
          onJSONDownload={onJSONDownload}
          onExportPDF={onExportPDF}
        />
      </div>
    </div>
  );
}

// Export individual components for direct use if needed
export { ShareButton } from './ShareButton';
export { MenuButton } from './MenuButton';
export { FloatingModeSelector } from './FloatingModeSelector'; 