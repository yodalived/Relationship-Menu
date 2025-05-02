import React from 'react';
import { MenuMode } from '../../../types';
import { IconEye, IconPencilPage, IconGear } from '../../../components/icons';

interface ModeSelectorProps {
  currentMode: MenuMode;
  onModeChange: (mode: MenuMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex rounded-md shadow-sm bg-[var(--main-text-color)] dark:bg-[var(--main-text-color)] p-1 min-w-[240px] w-full md:w-auto" role="group" aria-label="Menu mode selection">
      <button
        onClick={() => onModeChange('view')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
          currentMode === 'view' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
        title="View mode"
        aria-label="View mode"
        aria-pressed={currentMode === 'view'}
      >
        <IconEye className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">View mode</span>
      </button>
      <button
        onClick={() => onModeChange('fill')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
          currentMode === 'fill' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
        title="Fill mode"
        aria-label="Fill mode"
        aria-pressed={currentMode === 'fill'}
      >
        <IconPencilPage className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Fill mode</span>
      </button>
      <button
        onClick={() => onModeChange('edit')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center ${
          currentMode === 'edit' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
        title="Edit mode"
        aria-label="Edit mode"
        aria-pressed={currentMode === 'edit'}
      >
        <IconGear className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Edit mode</span>
      </button>
    </div>
  );
} 