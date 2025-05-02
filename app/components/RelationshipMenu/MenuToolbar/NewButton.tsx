import React from 'react';
import { IconPlus } from '../../../components/icons';

interface NewButtonProps {
  onClick: () => void;
}

export function NewButton({ onClick }: NewButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-3 bg-[rgba(148,188,194,0.15)] dark:bg-[rgba(79,139,149,0.15)] text-[var(--main-text-color)] rounded-md hover:bg-[rgba(148,188,194,0.3)] dark:hover:bg-[rgba(79,139,149,0.3)] transition-colors shadow-md text-sm font-medium flex-grow md:flex-grow-0 min-w-[100px] flex items-center justify-center border border-[var(--main-text-color)]"
      title="Create a new menu"
    >
      <IconPlus className="h-4 w-4 mr-1" />
      New Menu
    </button>
  );
} 