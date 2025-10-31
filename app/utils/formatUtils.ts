import { Person } from '../types';

/**
 * Formats people's names into a readable string with a custom joiner
 * Supports both legacy string[] and new Person[] formats
 */
export function formatPeopleNames(people: string[] | Person[], joiner: string = '&'): string {
  if (people.length === 0) return "";

  // Extract names from Person objects or use strings directly
  const names = people.map(p => typeof p === 'string' ? p : p.name);

  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} ${joiner} ${names[1]}`;

  // For 3+ people, join with commas but no comma before the joiner
  const lastPerson = names[names.length - 1];
  const otherPeople = names.slice(0, -1).join(', ');
  return `${otherPeople} ${joiner} ${lastPerson}`;
} 