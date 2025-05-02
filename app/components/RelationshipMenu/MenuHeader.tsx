import React from 'react';
import { MenuMode } from '../../types';
import { IconPlus, IconTrash } from '../icons';

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
    <div className="w-full md:w-auto">
      <div className="menu-header w-full">
        {mode === 'edit' ? (
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-2">Menu for:</h2>
            <div className="space-y-2">
              {people.map((personName, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => onPersonNameChange(index, e.target.value)}
                    className="p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-text-color)] focus:border-transparent"
                    placeholder="Person name"
                  />
                  {people.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onDeletePerson(index)}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors"
                      title="Remove person"
                    >
                      <IconTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={onAddPerson}
                className="mt-2 flex items-center text-[var(--main-text-color)] hover:text-[var(--main-text-color-hover)] transition-colors"
              >
                <IconPlus className="h-5 w-5 mr-1" />
                Add Person
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="truncate max-w-[calc(100vw-20px)] md:max-w-none mb-0 text-[var(--main-text-color)] dark:text-white text-2xl">Menu for {formatPeople(people)}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Last updated: {formatDate(lastUpdate)}</p>
          </>
        )}
      </div>
    </div>
  );
} 