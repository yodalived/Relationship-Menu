import React, { useRef, useEffect } from 'react';
import { 
  IconMust, 
  IconLike, 
  IconMaybe, 
  IconOffLimit,
  IconNotSet,
  IconTalk
} from '../icons';

// Available icon options for picker
export const ICON_OPTIONS = [
  { value: 'must', label: 'Must have', icon: IconMust, bgColor: 'bg-[#DEF0FF] dark:bg-[rgba(59,130,246,0.5)]' },
  { value: 'like', label: 'Would like', icon: IconLike, bgColor: 'bg-[#E6F7EC] dark:bg-[rgba(34,197,94,0.5)]' },
  { value: 'maybe', label: 'Maybe', icon: IconMaybe, bgColor: 'bg-[#FFF2D9] dark:bg-[rgba(245,158,11,0.5)]' },
  { value: 'off-limit', label: 'Off limits', icon: IconOffLimit, bgColor: 'bg-[#FFEBEB] dark:bg-[rgba(239,68,68,0.5)]' },
  { value: 'talk', label: 'Conversation', icon: IconTalk, bgColor: 'bg-[#F0EDFF] dark:bg-[rgba(139,92,246,0.5)]' },
  { value: null, label: 'Not set', icon: IconNotSet, bgColor: 'bg-[#F5F5F5] dark:bg-[#374151]' }
];

export function renderIcon(iconType: string | null | undefined) {
  const className = "icon-container";
  
  switch(iconType) {
    case 'must':
      return <div className={className}><IconMust /></div>;
    case 'like':
      return <div className={className}><IconLike /></div>;
    case 'maybe':
      return <div className={className}><IconMaybe /></div>;
    case 'off-limit':
      return <div className={className}><IconOffLimit /></div>;
    case 'talk':
      return <div className={className}><IconTalk /></div>;
    default:
      return <div className={className}><IconNotSet /></div>;
  }
}

interface IconPickerProps {
  selectedIcon: string | null;
  onSelectIcon: (icon: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'view' | 'fill' | 'edit';
}

export function IconPicker({ onSelectIcon, isOpen, onClose, mode = 'edit' }: IconPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  // In fill mode, filter out the talk icon
  const displayOptions = mode === 'fill' 
    ? ICON_OPTIONS.filter(option => option.value !== 'talk') 
    : ICON_OPTIONS;
  
  return (
    <div 
      ref={pickerRef}
      className="absolute z-10 mt-1 left-0 top-full sm:top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 border border-gray-100 dark:border-gray-700 w-full sm:w-[320px]"
    >
      <div className="grid grid-cols-2 gap-3">
        {displayOptions.map((option) => (
          <button
            key={option.value || 'null'}
            onClick={() => onSelectIcon(option.value)}
            className={`p-2.5 rounded-lg transition-all hover:brightness-95 active:scale-[0.98] ${option.bgColor} flex justify-start items-center`}
          >
            <div className="mr-2">
              <option.icon />
            </div>
            <span className="text-sm font-medium px-1.5 py-1 dark:text-gray-200">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface IconButtonProps {
  selectedIcon: string | null;
  onClick: () => void;
}

export function IconButton({ selectedIcon, onClick }: IconButtonProps) {
  const selectedOption = ICON_OPTIONS.find(opt => opt.value === selectedIcon) || ICON_OPTIONS[ICON_OPTIONS.length - 1];
  
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex items-center pl-2 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 sm:mr-3 ${
        selectedIcon ? selectedOption.bgColor : 'bg-white dark:bg-gray-800'
      }`}
      aria-label="Select icon"
    >
      {renderIcon(selectedIcon)}
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
        {selectedOption.label}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
} 