import React from 'react';
import { MenuItem } from '../../../types';
import { renderIcon } from '../../ui/IconPicker';
import { getItemClassName } from './utils';

interface ViewMenuItemProps {
  item: MenuItem;
}

export function ViewMenuItem({ item }: ViewMenuItemProps) {
  return (
    <div className={`item ${getItemClassName(item.icon)}`}>
      <div className="item-name">
        {renderIcon(item.icon)}
        <span>{item.name}</span>
      </div>
      {item.note && <div className="item-note">{item.note}</div>}
    </div>
  );
} 