'use client';

import { useState, useEffect } from 'react';

type TemplateIcon = {
  type: string;
  path: string;
};

type TemplateItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon?: TemplateIcon;
  stats?: {
    sections: number;
    items: number;
  };
};

type TemplateData = {
  menu: Array<{
    name: string;
    items: Array<{
      name: string;
      note?: string | null;
      icon?: string | null;
    }>;
  }>;
};

type PeopleFormProps = {
  selectedTemplate: TemplateItem;
  onSubmit: (templatePath: string, people: string[]) => void;
  onCancel: () => void;
};

// Helper component for rendering icons
const TemplateIcon = ({ icon }: { icon?: TemplateIcon }) => {
  // Default icon if none is provided
  const defaultPath = "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-8 w-8 text-[var(--main-text-color)]" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d={icon?.path || defaultPath} 
      />
    </svg>
  );
};

const PeopleForm = ({ selectedTemplate, onSubmit, onCancel }: PeopleFormProps) => {
  const [people, setPeople] = useState<string[]>(['', '']);
  const [error, setError] = useState<string | null>(null);

  const handleAddPerson = () => {
    setPeople([...people, '']);
  };

  const handleRemovePerson = (index: number) => {
    if (people.length <= 2) return;
    const newPeople = [...people];
    newPeople.splice(index, 1);
    setPeople(newPeople);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate people names
    const filteredPeople = people.filter(person => person.trim() !== '');
    if (filteredPeople.length < 2) {
      setError('Please enter at least two names');
      return;
    }
    
    onSubmit(selectedTemplate.path, filteredPeople);
  };

  return (
    <div className="max-w-full mx-auto overflow-hidden bg-white rounded-xl border border-[var(--main-bg-color)] border-opacity-20 shadow-sm">
      <div className="px-6 py-5 bg-[rgba(158,198,204,0.1)] border-b flex items-center">
        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-[rgba(158,198,204,0.3)] mr-4">
          <TemplateIcon icon={selectedTemplate.icon} />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-medium text-[var(--main-text-color)]">
            {selectedTemplate.title}
          </h3>
          {selectedTemplate.stats && (
            <div className="text-sm text-gray-600 mt-1">
              {selectedTemplate.stats.sections} sections · {selectedTemplate.stats.items} items
            </div>
          )}
        </div>
        <button 
          onClick={onCancel}
          className="rounded-full p-2 hover:bg-[rgba(158,198,204,0.2)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who's in this relationship?
            </label>
            
            <div className="space-y-3">
              {people.map((person, index) => (
                <div key={index} className="flex items-center group">
                  <div className="w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => {
                      const newPeople = [...people];
                      newPeople[index] = e.target.value;
                      setPeople(newPeople);
                    }}
                    placeholder={`Name of person ${index + 1}`}
                    className="flex-grow p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-bg-color)] focus:border-transparent"
                    required
                  />
                  {people.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePerson(index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddPerson}
              className="mt-4 flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Person
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--main-bg-color)] text-white rounded-md hover:bg-[var(--main-text-color)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-text-color)]"
            >
              Create Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TemplateSelectorProps {
  onTemplateSelected: (templatePath: string, people: string[]) => void;
}

export default function TemplateSelector({ onTemplateSelected }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
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
          data.templates.map(async (template: TemplateItem) => {
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

  const handleTemplateClick = (template: TemplateItem) => {
    setSelectedTemplate(template);
  };

  const handlePeopleSubmit = (templatePath: string, people: string[]) => {
    onTemplateSelected(templatePath, people);
  };

  if (isLoading) {
    return (
      <div className="mt-4 text-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--main-bg-color)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
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
        <div className="space-y-6">
          {templates.map(template => (
            <div 
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="relative border rounded-xl p-6 cursor-pointer hover:shadow-md group transition-all duration-300 hover:border-[var(--main-bg-color)] hover:bg-[rgba(158,198,204,0.05)]"
            >
              <div className="flex items-center space-x-5">
                <div className="hidden sm:flex sm:items-center sm:justify-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[rgba(158,198,204,0.2)]">
                    <TemplateIcon icon={template.icon} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-medium text-[var(--main-text-color)] group-hover:text-[var(--main-text-color-hover)] transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-gray-600 mt-2 mb-3">
                    {template.description}
                  </p>
                  
                  {template.stats && (
                    <div className="flex flex-wrap mt-4">
                      <div className="flex items-center mr-6 mb-2 bg-[rgba(158,198,204,0.1)] px-3 py-1.5 rounded-full text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-gray-700">{template.stats.sections} sections</span>
                      </div>
                      <div className="flex items-center mb-2 bg-[rgba(158,198,204,0.1)] px-3 py-1.5 rounded-full text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[var(--main-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-gray-700">{template.stats.items} items</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="hidden sm:flex items-center justify-center">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full border border-[var(--main-bg-color)] bg-white group-hover:bg-[var(--main-bg-color)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--main-text-color)] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 