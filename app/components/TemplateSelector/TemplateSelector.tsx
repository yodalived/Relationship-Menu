'use client';

import { useState, useEffect } from 'react';
import { TemplateItem as TemplateItemType, TemplateSelectorProps } from './types';
import { MenuData } from '../../types';
import PeopleForm from './PeopleForm';
import TemplateItem from './TemplateItem';
import { migrateMenuData } from '../../utils/migrations';
import { v4 as uuidv4 } from 'uuid';
import { IconWarning } from '../icons';

export default function TemplateSelector({
  onTemplateSelected,
  title = "Create a New Menu",
  subtitle = "Choose a template to get started quickly",
  className = ""
}: TemplateSelectorProps) {
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
              
              const templateData = await templateResponse.json() as MenuData;
              
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

  const handlePeopleSubmit = async (templatePath: string, people: string[]) => {
    try {
      // Fetch the template data
      const response = await fetch(templatePath);
      
      if (!response.ok) {
        throw new Error(`Error loading template: ${response.statusText}`);
      }
      
      // Parse the template data
      const templateData = await response.json() as MenuData;
      
      // Replace default people with custom names
      templateData.people = people;
      
      // Update last_update timestamp
      templateData.last_update = new Date().toISOString();
      
      // Migrate the template data to ensure it's on the latest schema
      const migratedData = migrateMenuData(templateData);
      
      // For templates, always generate a new UUID on load
      migratedData.uuid = uuidv4();
      
      // Count total items to determine initial mode
      const totalItems = migratedData.menu.reduce((total, section) => {
        return total + (section.items ? section.items.length : 0);
      }, 0);
      
      // If the template has items, open in 'fill' mode, otherwise 'edit' mode
      const initialMode = totalItems > 0 ? 'fill' : 'edit';
      
      // Pass the prepared menu data to the parent component
      onTemplateSelected(migratedData, initialMode);
    } catch (error) {
      console.error('Error processing template:', error);
      setError(`Failed to create menu: ${(error as Error).message}`);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-[rgba(158,198,204,0.3)] to-[rgba(99,159,169,0.2)] dark:from-[rgba(158,198,204,0.15)] dark:to-[rgba(99,159,169,0.1)] px-8 py-6">
        <h2 className="text-2xl font-bold text-[var(--main-text-color)]">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
      </div>
      <div className="p-4 sm:p-8">
        {isLoading ? (
          <div className="mt-4 text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--main-bg-color)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading templates...</p>
          </div>
        ) : error ? (
          <div className="mt-4 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center mb-2">
              <IconWarning className="h-5 w-5 mr-2" />
              <span className="font-medium">Error Loading Templates</span>
            </div>
            <p>{error}</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
} 