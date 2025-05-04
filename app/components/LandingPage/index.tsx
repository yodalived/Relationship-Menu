'use client';

import React, { useState, useEffect } from 'react';
import { TemplateSelector } from '../TemplateSelector';
import { FileSelector } from '../FileSelector';
import { AboutSection } from './AboutSection';
import { GettingStartedSection } from './GettingStartedSection';
import { PrivacySection } from './PrivacySection';
import { AttributionSection } from './AttributionSection';
import { Divider } from './Divider';
import { getAllMenus } from '../../utils/menuStorage';

export default function LandingPage() {
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
    <div className="max-w-4xl mx-auto">
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

      {/* Info Cards - Displayed in a grid layout */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* About this tool - Left column */}
        <AboutSection />
        
        {/* Right column - stacked cards */}
        <div className="space-y-8">
          {/* Getting Started - Top right */}
          <GettingStartedSection />
          
          {/* Privacy Information - Bottom right */}
          <PrivacySection />
        </div>
      </div>
      
      {/* Attribution */}
      <AttributionSection />
    </div>
  );
} 