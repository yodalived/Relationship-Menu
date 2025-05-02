'use client';

import { useState } from 'react';
import { MenuData } from '../../types';
import { migrateMenuData } from '../../utils/migrations';
import { extractMenuDataFromPDF } from '../../utils/pdf/extract';

interface FileUploadProps {
  onFileLoaded: (data: MenuData) => void;
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
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
          setError('Failed to extract data from PDF. Please upload a JSON file instead.');
          setIsProcessing(false);
        }
        return;
      }
      
      // Process JSON files
      if (file.type !== 'application/json' && !file.name.endsWith('.json') && !file.name.endsWith('.relationshipmenu')) {
        setError('Please upload a .json, .relationshipmenu, or .pdf file');
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
        <p className="text-gray-600 dark:text-gray-300 mt-1">Upload your menu file to continue working on it</p>
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          ) : (
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          )}
          <p className="mb-3 text-xl text-[var(--main-text-color)] font-semibold">
            {isProcessing ? 'Processing File...' : 'Upload Your Relationship Menu'}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
} 