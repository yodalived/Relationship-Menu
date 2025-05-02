import { useState } from 'react';
import { PeopleFormProps } from './types';
import TemplateIcon from './TemplateIcon';
import MenuStats from '../ui/MenuStats';
import { IconArrowLeft, IconWarning, IconPlusSolid } from '../icons';
import { PersonNameInput } from '../ui/PersonNameInput';

const PeopleForm = ({ selectedTemplate, onSubmit, onCancel }: PeopleFormProps) => {
  const [people, setPeople] = useState<string[]>(['']);
  const [error] = useState<string | null>(null);

  const handleAddPerson = () => {
    setPeople([...people, '']);
  };

  const handleRemovePerson = (index: number) => {
    if (people.length <= 1) return;
    const newPeople = [...people];
    newPeople.splice(index, 1);
    setPeople(newPeople);
  };

  const handlePersonChange = (index: number, value: string) => {
    const newPeople = [...people];
    newPeople[index] = value;
    setPeople(newPeople);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process people names, using "Anonymous" for empty names
    let processedPeople = people.map(person => person.trim() === '' ? 'Anonymous' : person.trim());
    
    // If no names were provided at all, use one "Anonymous" entry
    if (processedPeople.length === 0) {
      processedPeople = ['Anonymous'];
    }
    
    onSubmit(selectedTemplate.path, processedPeople);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-start mb-2 sm:mb-6">
        <div className="flex flex-1 mb-2 sm:mb-0">
          <div className="w-14 h-14 hidden sm:flex items-center justify-center rounded-full bg-[rgba(158,198,204,0.2)] dark:bg-[rgba(158,198,204,0.15)] mr-4 shadow-sm flex-shrink-0 self-center mt-1">
            <TemplateIcon icon={selectedTemplate.icon} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-[var(--main-text-color)] mb-1">
                {selectedTemplate.name}
              </h3>
              <button 
                onClick={onCancel}
                className="flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] px-3 py-1.5 rounded-lg border border-[rgba(158,198,204,0.2)] bg-[rgba(158,198,204,0.1)] hover:bg-[rgba(158,198,204,0.2)] transition-colors text-sm whitespace-nowrap ml-3 flex-shrink-0"
              >
                <IconArrowLeft className="h-4 w-4 mr-1.5" />
                Back to templates
              </button>
            </div>
            {selectedTemplate.stats && (
              <div className="hidden sm:block mt-2">
                <MenuStats 
                  sections={selectedTemplate.stats.sections} 
                  items={selectedTemplate.stats.items} 
                  compact={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-6 leading-relaxed">
        {selectedTemplate.description}
      </p>
      
      {selectedTemplate.stats && (
        <div className="sm:hidden mb-6">
          <MenuStats 
            sections={selectedTemplate.stats.sections} 
            items={selectedTemplate.stats.items} 
            compact={true}
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-lg font-medium text-[var(--main-text-color)] mb-4">
            Who's in this relationship?
            <span className="block text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
              Empty fields default to Anonymous
            </span>
          </label>
          
          <div className="space-y-4">
            {people.map((person, index) => (
              <PersonNameInput
                key={index}
                name={person}
                index={index}
                onChange={(value) => handlePersonChange(index, value)}
                onDelete={people.length > 1 ? () => handleRemovePerson(index) : undefined}
                showDelete={people.length > 1}
              />
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleAddPerson}
            className="mt-5 flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] transition-colors bg-[rgba(158,198,204,0.1)] dark:bg-[rgba(158,198,204,0.05)] hover:bg-[rgba(158,198,204,0.2)] dark:hover:bg-[rgba(158,198,204,0.1)] px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-[rgba(158,198,204,0.2)] text-sm sm:text-base"
          >
            <IconPlusSolid className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
            Add Another Person
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center">
            <IconWarning className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">{error}</span>
          </div>
        )}
        
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-text-color)] shadow-sm text-sm sm:text-base bg-[var(--main-text-color)] hover:bg-[var(--main-bg-color)]"
          >
            Create Menu
          </button>
        </div>
      </form>
    </div>
  );
};

export default PeopleForm; 