/**
 * Formats people's names into a readable string with a custom joiner
 */
export function formatPeopleNames(people: string[], joiner: string = '&'): string {
  if (people.length === 0) return "";
  if (people.length === 1) return people[0];
  if (people.length === 2) return `${people[0]} ${joiner} ${people[1]}`;
  
  // For 3+ people, join with commas but no comma before the joiner
  const lastPerson = people[people.length - 1];
  const otherPeople = people.slice(0, -1).join(', ');
  return `${otherPeople} ${joiner} ${lastPerson}`;
} 