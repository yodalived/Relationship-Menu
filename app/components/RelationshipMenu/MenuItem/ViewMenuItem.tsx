import React from 'react';
import { MenuItem } from '../../../types';
import { renderIcon, getIconLabel } from '../../ui/IconPicker';
import { getItemClassName } from './utils';

interface ViewMenuItemProps {
  item: MenuItem;
}

export function ViewMenuItem({ item }: ViewMenuItemProps) {
  // Get the icon label using the utility function
  const iconLabel = getIconLabel(item.icon);

  return (
    <div 
      className={`item ${getItemClassName(item.icon)}`}
      role="listitem"
    >
      <div className="item-name">
        {renderIcon(item.icon)}
        <span className="text-gray-900 dark:text-gray-50">{item.name}</span>
        <span className="sr-only">, {iconLabel}</span>
      </div>
      {item.note && (
        <div className="item-note text-gray-800 dark:text-gray-200" aria-label={`Note: ${item.note}`}>
          {item.note}
        </div>
      )}
    </div>
  );
} 