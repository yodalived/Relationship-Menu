import React from 'react';
import { IconLightning } from '../icons';

export function GettingStartedSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center">
        <IconLightning className="h-6 w-6 text-[var(--main-text-color)] mr-2" />
        <h3 className="text-xl font-bold text-[var(--main-text-color)]">Getting Started</h3>
      </div>
      
      <div className="p-6">
        <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
          <li>Create a new menu from a template or upload your existing one</li>
          <li>Review the options and discuss with your relationship partner(s)</li>
          <li>Customize and reflect your shared agreements</li>
          <li>Download or share your personalized menu</li>
        </ol>
      </div>
    </div>
  );
} 