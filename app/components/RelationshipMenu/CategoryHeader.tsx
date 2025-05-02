import React from 'react';
import { IconChevron, IconTrash } from '../icons';

interface CategoryHeaderProps {
  name: string;
  catIndex: number;
  isEditing: boolean;
  totalCategories: number;
  onNameChange: (catIndex: number, newName: string) => void;
  onMoveUp: (catIndex: number) => void;
  onMoveDown: (catIndex: number) => void;
  onDelete: (catIndex: number) => void;
}

export function CategoryHeader({
  name,
  catIndex,
  isEditing,
  totalCategories,
  onNameChange,
  onMoveUp,
  onMoveDown,
  onDelete
}: CategoryHeaderProps) {
  if (!isEditing) {
    return <h2 id={`category-header-${catIndex}`}>{name}</h2>;
  }
  
  return (
    <div className="flex items-center w-full justify-between" role="group" aria-label={`Edit category ${name}`}>
      <div className="flex-grow px-3">
        <label htmlFor={`category-name-${catIndex}`} className="sr-only">Category name</label>
        <input
          id={`category-name-${catIndex}`}
          type="text"
          value={name}
          onChange={(e) => onNameChange(catIndex, e.target.value)}
          className="w-full bg-transparent text-white text-center font-bold focus:outline-none border-b border-white border-dashed hover:border-solid focus:border-solid placeholder-white/70"
          placeholder="Edit section title..."
          aria-label="Edit section title"
          aria-describedby={`category-header-${catIndex}`}
        />
      </div>
      <div className="flex items-center mr-2" role="toolbar" aria-label="Category actions">
        <button
          type="button"
          onClick={() => onMoveUp(catIndex)}
          disabled={catIndex === 0}
          className={`p-1 mx-0.5 text-white ${catIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
          title="Move section left"
          aria-label="Move section left (or up on small screens)"
        >
          {/* Left arrow for larger screens, Up arrow for mobile */}
          <IconChevron direction="left" className="h-5 w-5 hidden md:block" />
          <IconChevron direction="up" className="h-5 w-5 md:hidden" />
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(catIndex)}
          disabled={catIndex === totalCategories - 1}
          className={`p-1 mx-0.5 text-white ${catIndex === totalCategories - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/30 rounded'}`}
          title="Move section right"
          aria-label="Move section right (or down on small screens)"
        >
          {/* Right arrow for larger screens, Down arrow for mobile */}
          <IconChevron direction="right" className="h-5 w-5 hidden md:block" />
          <IconChevron direction="down" className="h-5 w-5 md:hidden" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(catIndex)}
          className="p-1 mx-0.5 text-white border border-white/30 rounded hover:bg-red-400/70 hover:border-red-300"
          title="Delete this section"
          aria-label="Delete this section"
        >
          <IconTrash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 