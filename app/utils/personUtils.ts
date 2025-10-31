import { v4 as uuidv4 } from 'uuid';
import { Person, MenuData_2_0, PersonResponse } from '../types';

/**
 * Create a new Person with a unique ID
 */
export function createPerson(name: string, color?: string, avatar?: string): Person {
  return {
    id: uuidv4(),
    name,
    color,
    avatar
  };
}

/**
 * Find a person by ID
 */
export function findPersonById(people: Person[], personId: string): Person | undefined {
  return people.find(p => p.id === personId);
}

/**
 * Find a person by name (returns first match)
 */
export function findPersonByName(people: Person[], name: string): Person | undefined {
  return people.find(p => p.name === name);
}

/**
 * Check if a person name is unique in the people array
 */
export function isPersonNameUnique(people: Person[], name: string, excludeId?: string): boolean {
  return !people.some(p => p.name === name && p.id !== excludeId);
}

/**
 * Generate a unique name by appending a number if needed
 */
export function generateUniqueName(people: Person[], baseName: string): string {
  if (isPersonNameUnique(people, baseName)) {
    return baseName;
  }

  let counter = 2;
  let candidateName = `${baseName} ${counter}`;

  while (!isPersonNameUnique(people, candidateName)) {
    counter++;
    candidateName = `${baseName} ${counter}`;
  }

  return candidateName;
}

/**
 * Update a person's name, ensuring uniqueness
 */
export function updatePersonName(
  people: Person[],
  personId: string,
  newName: string
): Person[] {
  return people.map(person => {
    if (person.id === personId) {
      // Ensure the new name is unique (excluding this person)
      const uniqueName = isPersonNameUnique(people, newName, personId)
        ? newName
        : generateUniqueName(people.filter(p => p.id !== personId), newName);

      return { ...person, name: uniqueName };
    }
    return person;
  });
}

/**
 * Add a new person to the people array
 */
export function addPerson(people: Person[], name: string = "New Person"): {
  people: Person[];
  newPerson: Person;
} {
  const uniqueName = generateUniqueName(people, name);
  const newPerson = createPerson(uniqueName);

  return {
    people: [...people, newPerson],
    newPerson
  };
}

/**
 * Remove a person from the people array
 */
export function removePerson(people: Person[], personId: string): Person[] {
  return people.filter(p => p.id !== personId);
}

/**
 * Get person display name with optional fallback
 */
export function getPersonDisplayName(person: Person | undefined, fallback: string = "Unknown"): string {
  return person?.name || fallback;
}

/**
 * Format multiple person names for display
 * Examples: "Alice", "Alice & Bob", "Alice, Bob & Charlie"
 */
export function formatPersonNames(people: Person[]): string {
  if (people.length === 0) return "Untitled Menu";
  if (people.length === 1) return people[0].name;
  if (people.length === 2) return `${people[0].name} & ${people[1].name}`;

  const lastPerson = people[people.length - 1];
  const otherPeople = people.slice(0, -1);

  return `${otherPeople.map(p => p.name).join(', ')} & ${lastPerson.name}`;
}

/**
 * Initialize responses for a new person across all menu items
 */
export function initializeResponsesForPerson(
  menuData: MenuData_2_0,
  personId: string
): MenuData_2_0 {
  const updatedMenu = menuData.menu.map(category => ({
    ...category,
    items: category.items.map(item => {
      // Initialize empty response for this person
      const newResponse: PersonResponse = {
        desire: null,
        boundary: null,
        last_updated: null
      };

      return {
        ...item,
        responses: {
          ...item.responses,
          [personId]: newResponse
        }
      };
    })
  }));

  return {
    ...menuData,
    menu: updatedMenu,
    last_update: new Date().toISOString()
  };
}

/**
 * Remove all responses for a person across all menu items
 */
export function removeResponsesForPerson(
  menuData: MenuData_2_0,
  personId: string
): MenuData_2_0 {
  const updatedMenu = menuData.menu.map(category => ({
    ...category,
    items: category.items.map(item => {
      if (!item.responses) return item;

      // Remove this person's responses
      const { [personId]: removed, ...remainingResponses } = item.responses;

      return {
        ...item,
        responses: remainingResponses
      };
    })
  }));

  return {
    ...menuData,
    menu: updatedMenu,
    last_update: new Date().toISOString()
  };
}

/**
 * Update all responses when a person's ID needs to change
 * (Should rarely be needed, but useful for data fixes)
 */
export function updatePersonIdInResponses(
  menuData: MenuData_2_0,
  oldPersonId: string,
  newPersonId: string
): MenuData_2_0 {
  const updatedMenu = menuData.menu.map(category => ({
    ...category,
    items: category.items.map(item => {
      if (!item.responses || !item.responses[oldPersonId]) return item;

      // Move responses from old ID to new ID
      const response = item.responses[oldPersonId];
      const { [oldPersonId]: removed, ...otherResponses } = item.responses;

      return {
        ...item,
        responses: {
          ...otherResponses,
          [newPersonId]: response
        }
      };
    })
  }));

  return {
    ...menuData,
    menu: updatedMenu,
    last_update: new Date().toISOString()
  };
}

/**
 * Copy responses from one person to another
 * Useful for initializing a new person's responses based on another
 */
export function copyResponses(
  menuData: MenuData_2_0,
  fromPersonId: string,
  toPersonId: string
): MenuData_2_0 {
  const updatedMenu = menuData.menu.map(category => ({
    ...category,
    items: category.items.map(item => {
      if (!item.responses || !item.responses[fromPersonId]) return item;

      // Copy responses with updated timestamp
      const copiedResponse: PersonResponse = {
        ...item.responses[fromPersonId],
        last_updated: new Date().toISOString()
      };

      return {
        ...item,
        responses: {
          ...item.responses,
          [toPersonId]: copiedResponse
        }
      };
    })
  }));

  return {
    ...menuData,
    menu: updatedMenu,
    last_update: new Date().toISOString()
  };
}
