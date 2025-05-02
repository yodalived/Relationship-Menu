import React from 'react';
import { MenuMode } from '../../../types';

interface ModeSelectorProps {
  currentMode: MenuMode;
  onModeChange: (mode: MenuMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex rounded-md shadow-sm bg-[var(--main-text-color)] dark:bg-[var(--main-text-color)] p-1 min-w-[240px] w-full md:w-auto">
      <button
        onClick={() => onModeChange('view')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentMode === 'view' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
      >
        View
      </button>
      <button
        onClick={() => onModeChange('fill')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentMode === 'fill' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
      >
        Fill
      </button>
      <button
        onClick={() => onModeChange('edit')}
        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          currentMode === 'edit' 
            ? 'bg-white dark:bg-white text-[var(--main-text-color)] shadow-sm' 
            : 'text-white hover:bg-[var(--main-text-color-hover)]'
        }`}
      >
        Edit
      </button>
    </div>
  );
} 