'use client';

import { useState } from 'react';
import TemplateSelector from './TemplateSelector';
import Link from 'next/link';
import { MenuData } from '../types';

interface FileUploadProps {
  onFileLoaded: (data: MenuData) => void;
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const processFile = (file?: File) => {
    setError(null);
    
    if (!file) {
      setError('No file selected');
      return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please upload a JSON file');
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
        
        onFileLoaded(data);
      } catch (err) {
        setError((err as Error).message || 'Failed to parse JSON file');
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
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
      
      onFileLoaded(templateData);
    } catch (error) {
      setError(`Failed to load template: ${(error as Error).message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Template Selector - Now First */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] px-8 py-6">
          <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Create a New Menu</h2>
          <p className="text-gray-600 mt-1">Choose from our templates to get started quickly</p>
        </div>
        <div className="p-4 sm:p-8">
          <TemplateSelector onTemplateSelected={handleTemplateSelected} />
        </div>
      </div>
      
      {/* Divider */}
      <div className="my-12 flex items-center justify-center">
        <div className="border-t border-gray-300 w-1/3"></div>
        <div className="px-4">
          <span className="bg-white text-gray-500 text-lg font-medium rounded-full px-4 py-2 shadow-sm">or</span>
        </div>
        <div className="border-t border-gray-300 w-1/3"></div>
      </div>
      
      {/* File Upload - Now Second */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
        <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] px-8 py-6">
          <h2 className="text-2xl font-bold text-[var(--main-text-color)]">Have an Existing Menu?</h2>
          <p className="text-gray-600 mt-1">Upload your JSON file to continue working on it</p>
        </div>
        <div className="p-8">
          <div 
            className={`border-3 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 hover:bg-[rgba(158,198,204,0.05)] ${
              isDragging ? 'border-[var(--main-text-color)] bg-blue-50 scale-[1.02]' : 'border-[var(--main-bg-color)]'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="mb-6 transform transition-transform duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="mb-3 text-xl text-[var(--main-text-color)] font-semibold">
              Upload Your Relationship Menu
            </p>
            <p className="text-[var(--main-text-color-hover)] mb-2">
              Drag and drop a JSON file or click to browse
            </p>
            
            <input 
              id="file-input"
              type="file" 
              accept=".json,application/json" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] px-6 py-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-[var(--main-text-color)]">About this tool</h3>
          </div>
          
          <div className="p-6">
            <div className="prose prose-sm max-w-none text-gray-600">
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
              
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-center">
                <p><strong>You like this tool?</strong> Send me an <a href="mailto:relationshipmenu@paviro.de" className="text-[var(--main-text-color)] hover:underline">e-mail</a> — as no tracking is used and your data is stored in your browser, I have no way of knowing if anyone is actually using it!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - stacked cards */}
        <div className="space-y-8">
          {/* Getting Started - Top right */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] px-6 py-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-[var(--main-text-color)]">Getting Started</h3>
            </div>
            
            <div className="p-6">
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Create a new menu from a template or upload your existing one</li>
                <li>Review the options and discuss with your relationship partner(s)</li>
                <li>Customize to reflect your shared agreements</li>
                <li>Download or share your personalized menu</li>
              </ol>
            </div>
          </div>
          
          {/* Privacy Information - Bottom right */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] px-6 py-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--main-text-color)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-[var(--main-text-color)]">Privacy Information</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1.5 rounded-full mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[var(--main-text-color)]">100% Private:</strong> 
                    <span className="ml-2 text-gray-600">All your relationship menu data stays locally in your browser until you explicitly share it with someone via a link or as a json file.</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-1.5 rounded-full mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-[var(--main-text-color)]">Local Storage:</strong> 
                    <span className="ml-2 text-gray-600">Your relationship menu is automatically saved in your browser's local storage, so you can safely reload the page or return later without losing any data.</span>
                  </div>
                </div>
                
                <div className="text-center mt-4 pt-4 border-t border-gray-100 text-gray-600">
                  <Link href="/privacy-policy" className="text-[var(--main-text-color)] hover:underline font-medium">More details on how your data is handled.</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attribution */}
      <div className="mt-8 text-center text-sm text-gray-500">
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