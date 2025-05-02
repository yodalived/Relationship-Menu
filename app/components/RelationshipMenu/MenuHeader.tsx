import React from 'react';
import { MenuMode } from '../../types';
import { IconPlus, IconInfo } from '../icons';
import { PersonNameInput } from '../ui/PersonNameInput';

interface MenuHeaderProps {
  mode: MenuMode;
  people: string[];
  lastUpdate: string;
  onPersonNameChange: (personIndex: number, newName: string) => void;
  onAddPerson: () => void;
  onDeletePerson: (personIndex: number) => void;
}

export function MenuHeader({
  mode,
  people,
  lastUpdate,
  onPersonNameChange,
  onAddPerson,
  onDeletePerson
}: MenuHeaderProps) {
  const formatPeople = (people: string[]) => {
    if (people.length === 0) return "";
    if (people.length === 1) return people[0];
    if (people.length === 2) return `${people[0]} and ${people[1]}`;
    return `${people.slice(0, -1).join(', ')}, and ${people[people.length - 1]}`;
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full md:w-auto transition-all duration-150">
      {mode === 'edit' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 transition-all">
          <h2 className="text-xl font-bold mb-5 text-[var(--main-text-color)] dark:text-[var(--main-text-color)] transition-colors">Menu for:</h2>
          <div className="space-y-4 w-full max-w-xl">
            {people.map((personName, index) => (
              <PersonNameInput
                key={index}
                name={personName}
                index={index}
                onChange={(value) => onPersonNameChange(index, value)}
                onDelete={people.length > 2 ? () => onDeletePerson(index) : undefined}
                showDelete={people.length > 2}
              />
            ))}
            <button
              type="button"
              onClick={onAddPerson}
              className="mt-4 flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] transition-all duration-150 bg-[rgba(158,198,204,0.1)] dark:bg-[rgba(158,198,204,0.05)] hover:bg-[rgba(158,198,204,0.2)] dark:hover:bg-[rgba(158,198,204,0.1)] px-4 py-2 rounded-lg shadow-sm border border-[rgba(158,198,204,0.2)] text-base"
            >
              <IconPlus className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
              Add Person
            </button>
          </div>
        </div>
      ) : (
        <div className="transition-all duration-150">
          <div className="flex items-center">
            <IconInfo className="h-6 w-6 text-[var(--main-text-color)] mr-2 transition-transform hover:scale-110" />
            <h2 className="text-[var(--main-text-color)] dark:text-[var(--main-text-color)] font-bold text-2xl transition-colors">
              Menu for {formatPeople(people)}
            </h2>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 pl-8 transition-colors">Last updated: {formatDate(lastUpdate)}</p>
        </div>
      )}
    </div>
  );
} 