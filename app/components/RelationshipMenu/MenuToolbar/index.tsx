import React from 'react';
import { ExportButton } from './ExportButton';
import { MenuButton } from './MenuButton';
import { MenuData } from '../../../types';
import { ToastType } from '../../../components/ui/Toast/ToastContext';

interface MenuToolbarProps {
  onJSONDownload: () => void;
  onExportPDF: () => void;
  menuData: MenuData;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

export function MenuToolbar({
  onJSONDownload,
  onExportPDF,
  menuData,
  showToast,
}: MenuToolbarProps) {
  return (
    <div className="flex w-full md:w-auto gap-2 justify-end">
      {/* New Menu Button Component - 50% width on small screens */}
      <div className="w-1/2 md:w-auto">
        <MenuButton />
      </div>
      
      {/* Share Button Component - 50% width on small screens */}
      <div className="w-1/2 md:w-auto">
        <ExportButton 
          onJSONDownload={onJSONDownload}
          onExportPDF={onExportPDF}
          menuData={menuData}
          showToast={showToast}
        />
      </div>
    </div>
  );
}

// Export individual components for direct use if needed
export { ExportButton } from './ExportButton';
export { MenuButton } from './MenuButton';
export { FloatingModeSelector } from './FloatingModeSelector'; 