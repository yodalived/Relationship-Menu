import React, { useRef, useEffect, useState } from 'react';
import { MenuMode } from '../../../types';
import { IconEye, IconPencilPage, IconGear } from '../../../components/icons';

interface ModeSelectorProps {
  currentMode: MenuMode;
  onModeChange: (mode: MenuMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const viewRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLButtonElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Get the currently selected button
    const activeRef = 
      currentMode === 'view' ? viewRef.current : 
      currentMode === 'fill' ? fillRef.current : 
      editRef.current;
    
    if (activeRef) {
      // Update the indicator position and width to match the active button
      setIndicatorStyle({
        left: `${activeRef.offsetLeft}px`,
        width: `${activeRef.offsetWidth}px`,
      });
    }
  }, [currentMode]);

  return (
    <div className="flex rounded-lg border border-[var(--main-text-color)] bg-[rgba(148,188,194,0.15)] dark:bg-[rgba(79,139,149,0.15)] p-1 min-w-[200px] md:min-w-[240px] relative" role="group" aria-label="Menu mode selection">
      {/* Sliding indicator */}
      <div 
        className="absolute top-1 bottom-1 rounded-md bg-[var(--main-text-color)] transition-all duration-150 ease-in-out z-0" 
        style={indicatorStyle}
        aria-hidden="true"
      />
      
      <button
        ref={viewRef}
        onClick={() => onModeChange('view')}
        className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center relative z-10 ${
          currentMode === 'view' 
            ? 'text-white' 
            : 'text-[var(--main-text-color)] hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)]'
        }`}
        title="View mode"
        aria-label="View mode"
        aria-pressed={currentMode === 'view'}
      >
        <IconEye className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only md:not-sr-only md:ml-2">View</span>
      </button>
      <button
        ref={fillRef}
        onClick={() => onModeChange('fill')}
        className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center relative z-10 ${
          currentMode === 'fill' 
            ? 'text-white' 
            : 'text-[var(--main-text-color)] hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)]'
        }`}
        title="Fill mode"
        aria-label="Fill mode"
        aria-pressed={currentMode === 'fill'}
      >
        <IconPencilPage className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only md:not-sr-only md:ml-2">Fill</span>
      </button>
      <button
        ref={editRef}
        onClick={() => onModeChange('edit')}
        className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center relative z-10 ${
          currentMode === 'edit' 
            ? 'text-white' 
            : 'text-[var(--main-text-color)] hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)]'
        }`}
        title="Edit mode"
        aria-label="Edit mode"
        aria-pressed={currentMode === 'edit'}
      >
        <IconGear className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
      </button>
    </div>
  );
} 