'use client';

import { useState } from 'react';
import TemplateSelector from './TemplateSelector';
import Link from 'next/link';
import { MenuData } from '../types';
import { migrateMenuData } from '../utils/migrations';
import { extractMenuDataFromPDF } from '../utils/pdf/extract';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onFileLoaded: (data: MenuData) => void;
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
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

  const handleTemplateSelected = async (templatePath: string, people: string[]) => {
    try {
      const response = await fetch(templatePath);
      
      if (!response.ok) {
        throw new Error(`Error loading template: ${response.statusText}`);
      }
      
      const templateData = await response.json() as MenuData;
      
      // Replace default people with custom names
      templateData.people = people;
      
      // Update last_update timestamp
      templateData.last_update = new Date().toISOString();
      
      // Migrate the template data to ensure it's on the latest schema
      let migratedData = migrateMenuData(templateData);
      
      // For templates, always generate a new UUID on load
      migratedData.uuid = uuidv4();
      
      onFileLoaded(migratedData);
    } catch (error) {
      setError(`Failed to load template: ${(error as Error).message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Template Selector - Now First */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-8 py-6">
          <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Create a New Menu</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Choose a template to get started quickly</p>
        </div>
        <div className="p-4 sm:p-8">
          <TemplateSelector onTemplateSelected={handleTemplateSelected} />
        </div>
      </div>
      
      {/* Divider */}
      <div className="my-12 flex items-center justify-center">
        <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
        <div className="px-4">
          <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-lg font-medium rounded-full px-4 py-2 shadow-sm">or</span>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-600 w-1/3"></div>
      </div>
      
      {/* File Upload - Now Second */}
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

      {/* Info Cards - Displayed in a grid layout */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* About this tool - Left column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-[var(--main-text-color)]">About this tool</h3>
          </div>
          
          <div className="p-6">
            <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                This tool welcomes all forms of connection — whether platonic, familial, professional or romantic.
                It's designed to bring clarity to how we define our unique relationships.
              </p>
              
              <div className="my-4 pl-4 border-l-4 border-[var(--main-bg-color)] italic">
                <p>Think of relationships as customizable recipes — you and others select ingredients from the menu 
                that appeal to your tastes and preferences. The resulting "dish" becomes your relationship.</p>
              </div>
              
              <h4 className="text-lg font-semibold my-4 text-[var(--main-text-color)]">Key principles:</h4>
              
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Conscious co-creation</strong> — Openly discussing desires and boundaries prevents 
                  misunderstandings and disappointment
                </li>
                <li>
                  <strong>Flexibility over time</strong> — Your relationship "plate" can evolve as you and your 
                  connections change
                </li>
                <li>
                  <strong>Regular check-ins</strong> — Revisit your menu periodically to reflect changing needs 
                  and desires
                </li>
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-center">
                <p><strong>You like this tool?</strong> Send me an <a href="mailto:paul-vincent@relationshipmenu.org" className="text-[var(--main-text-color)] hover:underline">e-mail</a> — as no tracking is used and your data is stored in your browser, I have no way of knowing if anyone is actually using it!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - stacked cards */}
        <div className="space-y-8">
          {/* Getting Started - Top right */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
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
          
          {/* Privacy Information - Bottom right */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-6 py-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-[var(--main-text-color)]">Privacy Information</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[var(--main-text-color)]">100% Private:</strong> 
                    <span className="ml-2 text-gray-600 dark:text-gray-300">All your relationship menu data stays locally in your browser until you explicitly share it with someone via a link or as a json file.</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[var(--main-text-color)]">Local Storage:</strong> 
                    <span className="ml-2 text-gray-600 dark:text-gray-300">Your relationship menu is automatically saved in your browser's local storage, so you can safely reload the page or return later without losing any data.</span>
                  </div>
                </div>
                
                <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                  <Link href="/privacy-policy" className="text-[var(--main-text-color)] hover:underline font-medium">More details on how your data is handled.</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attribution */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This version of the Non-Escalator Relationship Menu was created by <a href="https://paulvincentroll.com/" className="text-[var(--main-text-color)] hover:underline mx-1" target="_blank" rel="noopener noreferrer">Paul-Vincent Roll</a>.
        </p>
        <p>
          Based on the 
          <a href="https://drive.google.com/drive/folders/17Hc3UFkDX3qA4IGYmjxEQhMW9BUOdPxt" className="text-[var(--main-text-color)] hover:underline mx-1" target="_blank" rel="noopener noreferrer">
            Relationship Anarchy Smörgåsbord (Version 6)
          </a> 
          and the 
          <a href="https://www.reddit.com/r/polyamory/comments/pwkdxp/v3_relationship_components_menu_last_update_for" className="text-[var(--main-text-color)] hover:underline mx-1" target="_blank" rel="noopener noreferrer">
            Non-Escalator Relationship Menu (Version 3)
          </a>
        </p>
      </div>
    </div>
  );
} 