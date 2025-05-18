'use client';

import { useState, useEffect } from 'react';
import { TemplateSelector } from '../TemplateSelector';
import { FileSelector } from '../FileSelector';
import { Divider } from './Divider';
import { getAllMenus } from '../../utils/menuStorage';

export default function DynamicContent() {
  const [hasSavedMenus, setHasSavedMenus] = useState(false);
  
  // Check if we have saved menus on component mount
  useEffect(() => {
    try {
      const menus = getAllMenus();
      setHasSavedMenus(menus.length > 0);
    } catch (error) {
      console.error('Error checking for saved menus:', error);
    }
  }, []);
  
  return (
    <>
      {hasSavedMenus ? (
        // When saved menus exist, show FileSelector first
        <>
          {/* File Upload Section */}
          <FileSelector />
          
          {/* Divider */}
          <Divider />
          
          {/* Template Section */}
          <TemplateSelector 
            className="mb-16"
          />
        </>
      ) : (
        // When no saved menus, show TemplateSelector first (original order)
        <>
          {/* Template Section */}
          <TemplateSelector 
            className="mb-16"
          />
          
          {/* Divider */}
          <Divider />
          
          {/* File Upload Section */}
          <FileSelector />
        </>
      )}
    </>
  );
} 