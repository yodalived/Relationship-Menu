'use client';

import { useState, useEffect } from 'react';
import { TemplateItem as TemplateItemType, TemplateData, TemplateSelectorProps } from './types';
import PeopleForm from './PeopleForm';
import TemplateItem from './TemplateItem';

export default function TemplateSelector({ onTemplateSelected }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItemType | null>(null);
  const [templates, setTemplates] = useState<TemplateItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates from the JSON file
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        // Fetch the templates metadata
        const response = await fetch('/templates/templates.json');
        if (!response.ok) {
          throw new Error(`Failed to load templates: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.templates || !Array.isArray(data.templates)) {
          throw new Error('Invalid templates format');
        }
        
        // For each template, fetch the actual template data to calculate stats
        const templatesWithStats = await Promise.all(
          data.templates.map(async (template: TemplateItemType) => {
            try {
              const templateResponse = await fetch(template.path);
              if (!templateResponse.ok) {
                return template;
              }
              
              const templateData: TemplateData = await templateResponse.json();
              
              if (templateData.menu && Array.isArray(templateData.menu)) {
                // Calculate stats
                const sections = templateData.menu.length;
                const items = templateData.menu.reduce((total, section) => {
                  return total + (section.items ? section.items.length : 0);
                }, 0);
                
                return {
                  ...template,
                  stats: { sections, items }
                };
              }
              
              return template;
            } catch (error) {
              console.error(`Error loading template ${template.id}:`, error);
              return template;
            }
          })
        );
        
        setTemplates(templatesWithStats);
      } catch (error) {
        console.error('Error loading templates:', error);
        setError('Failed to load templates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  const handleTemplateClick = (template: TemplateItemType) => {
    setSelectedTemplate(template);
  };

  const handlePeopleSubmit = (templatePath: string, people: string[]) => {
    onTemplateSelected(templatePath, people);
  };

  if (isLoading) {
    return (
      <div className="mt-4 text-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--main-bg-color)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Error Loading Templates</span>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {selectedTemplate ? (
        <div>
          <PeopleForm 
            selectedTemplate={selectedTemplate} 
            onSubmit={handlePeopleSubmit}
            onCancel={() => setSelectedTemplate(null)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map(template => (
            <TemplateItem 
              key={template.id}
              template={template}
              onClick={handleTemplateClick}
            />
          ))}
        </div>
      )}
    </div>
  );
} 