'use client';

import { useState } from 'react';
import { MenuData } from '../../types';
import { migrateMenuData } from '../../utils/migrations';
import { extractMenuDataFromPDF } from '../../utils/pdf/extract';
import { IconCloud, IconSpinner, IconWarning } from '../icons';

interface FileSelectorProps {
  onFileLoaded: (data: MenuData) => void;
}

export function FileSelector({ onFileLoaded }: FileSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file?: File) => {
    setError(null);
    setIsProcessing(true);
    
    if (!file) {
      setError('No file selected');
      setIsProcessing(false);
      return;
    }

    try {
      // Check if it's a PDF file
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          // Convert the file to an ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Use the utility function to extract menu data
          const menuData = await extractMenuDataFromPDF(arrayBuffer);
          
          if (menuData) {
            onFileLoaded(menuData);
            setIsProcessing(false);
            return;
          }
          
          setError('No relationship menu data found in this PDF');
          setIsProcessing(false);
        } catch (err) {
          console.error('Error processing PDF:', err);
          setError('Failed to extract data from PDF. Please select a JSON file instead.');
          setIsProcessing(false);
        }
        return;
      }
      
      // Process JSON files
      if (file.type !== 'application/json' && !file.name.endsWith('.json') && !file.name.endsWith('.relationshipmenu')) {
        setError('Please select a .json, .relationshipmenu, or .pdf file');
        setIsProcessing(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as MenuData;
          
          // Validate the data structure
          if (!data.last_update || !Array.isArray(data.people) || !Array.isArray(data.menu)) {
            throw new Error('Invalid JSON structure. The file must contain last_update, people, and menu fields.');
          }
          
          // Migrate data to latest schema version
          const migratedData = migrateMenuData(data);
          
          onFileLoaded(migratedData);
          setIsProcessing(false);
        } catch (err) {
          setError((err as Error).message || 'Failed to parse JSON file');
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      
      reader.readAsText(file);
    } catch (err) {
      setError((err as Error).message || 'Failed to process file');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16">
      <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-8 py-6">
        <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Have an Existing Menu?</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Open your menu file to continue working on it</p>
      </div>
      <div className="p-8">
        <div 
          className={`border-3 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 hover:bg-[rgba(158,198,204,0.05)] dark:hover:bg-[rgba(158,198,204,0.03)] ${
            isDragging ? 'border-[var(--main-text-color)] bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' : 'border-[var(--main-bg-color)] dark:border-[rgba(158,198,204,0.4)]'
          } ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
        >
          {isProcessing ? (
            <div className="mb-6 animate-spin">
              <IconSpinner className="h-16 w-16 mx-auto text-[var(--main-text-color)]" />
            </div>
          ) : (
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
              <IconCloud className="h-16 w-16 mx-auto text-[var(--main-text-color)]" />
            </div>
          )}
          <p className="mb-3 text-xl text-[var(--main-text-color)] font-semibold">
            {isProcessing ? 'Processing File...' : 'Open Your Relationship Menu'}
          </p>
          {!isProcessing && (
            <>
              <p className="text-[var(--main-text-color-hover)] mb-2">
                Drag and drop a menu file or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                (supports pdf files created by this website, .json and .relationshipmenu files)
              </p>
            </>
          )}
          
          <input 
            id="file-input"
            type="file" 
            accept=".json,.relationshipmenu,.pdf,application/json,application/pdf" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-start">
            <IconWarning className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 