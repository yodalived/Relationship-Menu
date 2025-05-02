'use client';

import React from 'react';
import { MenuData } from '../../types';
import { TemplateSelector } from '../TemplateSelector';
import { FileUpload } from './FileUpload';
import { AboutSection } from './AboutSection';
import { GettingStartedSection } from './GettingStartedSection';
import { PrivacySection } from './PrivacySection';
import { AttributionSection } from './AttributionSection';

interface HomePageProps {
  onFileLoaded: (data: MenuData) => void;
}

export default function HomePage({ onFileLoaded }: HomePageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Template Section */}
      <TemplateSelector 
        onTemplateSelected={onFileLoaded}
        className="mb-16"
      />
      
      {/* Divider */}
      <div className="my-12 flex items-center justify-center">
        <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
        <div className="px-4">
          <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-lg font-medium rounded-full px-4 py-2 shadow-sm">or</span>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
      </div>
      
      {/* File Upload Section */}
      <FileUpload onFileLoaded={onFileLoaded} />

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