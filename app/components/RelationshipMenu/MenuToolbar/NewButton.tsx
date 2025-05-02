import React from 'react';
import { IconPlus } from '../../../components/icons';

interface NewButtonProps {
  onClick: () => void;
}

export function NewButton({ onClick }: NewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-2 bg-[var(--main-text-color)] text-white rounded-md hover:bg-[var(--main-text-color-hover)] transition-colors text-sm font-medium flex-grow md:flex-grow-0 min-w-[100px] flex items-center justify-center"
      title="Create a new menu"
    >
      <IconPlus className="h-4 w-4 mr-1" />
      New Menu
    </button>
  );
} 