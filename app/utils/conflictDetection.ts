import {
  MenuData_2_0,
  Person,
  PersonResponse,
  ResponseConflict,
  MenuItem_2_0,
  isSchema2_0
} from '../types';

/**
 * Detect conflicts within a person's own responses
 * (desire vs boundary mismatches)
 */
function detectDesireBoundaryConflicts(
  item: MenuItem_2_0,
  categoryName: string,
  people: Person[]
): ResponseConflict[] {
  const conflicts: ResponseConflict[] = [];

  if (!item.responses) return conflicts;

  Object.entries(item.responses).forEach(([personId, response]) => {
    const person = people.find(p => p.id === personId);
    if (!person) return;

    // Conflict: desire is "must" but boundary is "hard-boundary"
    if (response.desire === 'must' && response.boundary === 'hard-boundary') {
      conflicts.push({
        type: 'desire-boundary',
        severity: 'error',
        itemName: item.name,
        categoryName: categoryName,
        personIds: [personId],
        description: `${person.name} marked this as "must have" but also as a "hard boundary" - these conflict with each other.`
      });
    }

    // Warning: desire is "like" or "must" but boundary is "hard-boundary"
    if ((response.desire === 'like' || response.desire === 'must') &&
        response.boundary === 'hard-boundary') {
      conflicts.push({
        type: 'desire-boundary',
        severity: 'warning',
        itemName: item.name,
        categoryName: categoryName,
        personIds: [personId],
        description: `${person.name} wants this ("${response.desire}") but marked it as a "hard boundary" - this may need clarification.`
      });
    }

    // Warning: desire is "off-limit" but boundary is "enthusiastic" or "comfortable"
    if (response.desire === 'off-limit' &&
        (response.boundary === 'enthusiastic' || response.boundary === 'comfortable')) {
      conflicts.push({
        type: 'desire-boundary',
        severity: 'warning',
        itemName: item.name,
        categoryName: categoryName,
        personIds: [personId],
        description: `${person.name} doesn't want this ("off-limit") but is comfortable with it - this may indicate they're willing but not desiring.`
      });
    }
  });

  return conflicts;
}

/**
 * Detect conflicts between different people's responses
 * (interpersonal compatibility issues)
 */
function detectInterpersonalConflicts(
  item: MenuItem_2_0,
  categoryName: string,
  people: Person[]
): ResponseConflict[] {
  const conflicts: ResponseConflict[] = [];

  if (!item.responses || people.length < 2) return conflicts;

  const responses = Object.entries(item.responses);

  // Compare each pair of people
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const [personId1, response1] = responses[i];
      const [personId2, response2] = responses[j];

      const person1 = people.find(p => p.id === personId1);
      const person2 = people.find(p => p.id === personId2);

      if (!person1 || !person2) continue;

      // Error: One person has "must" desire, other has "hard-boundary" boundary
      if (response1.desire === 'must' && response2.boundary === 'hard-boundary') {
        conflicts.push({
          type: 'interpersonal',
          severity: 'error',
          itemName: item.name,
          categoryName: categoryName,
          personIds: [personId1, personId2],
          description: `${person1.name} needs this ("must have") but ${person2.name} has marked it as a "hard boundary" - this is a fundamental incompatibility.`
        });
      }

      if (response2.desire === 'must' && response1.boundary === 'hard-boundary') {
        conflicts.push({
          type: 'interpersonal',
          severity: 'error',
          itemName: item.name,
          categoryName: categoryName,
          personIds: [personId1, personId2],
          description: `${person2.name} needs this ("must have") but ${person1.name} has marked it as a "hard boundary" - this is a fundamental incompatibility.`
        });
      }

      // Warning: One person "off-limit", other "must"
      if ((response1.desire === 'off-limit' && response2.desire === 'must') ||
          (response2.desire === 'off-limit' && response1.desire === 'must')) {
        const offLimitPerson = response1.desire === 'off-limit' ? person1 : person2;
        const mustPerson = response1.desire === 'off-limit' ? person2 : person1;

        conflicts.push({
          type: 'interpersonal',
          severity: 'warning',
          itemName: item.name,
          categoryName: categoryName,
          personIds: [personId1, personId2],
          description: `${mustPerson.name} needs this while ${offLimitPerson.name} doesn't want it - requires discussion to find compromise.`
        });
      }

      // Warning: Significant desire gap (one "like"/"must", other "prefer-not"/"off-limit")
      const highDesires = ['like', 'must'];
      const lowDesires = ['prefer-not', 'off-limit'];

      if ((highDesires.includes(response1.desire as string) && lowDesires.includes(response2.desire as string)) ||
          (highDesires.includes(response2.desire as string) && lowDesires.includes(response1.desire as string))) {
        conflicts.push({
          type: 'compatibility',
          severity: 'warning',
          itemName: item.name,
          categoryName: categoryName,
          personIds: [personId1, personId2],
          description: `${person1.name} and ${person2.name} have significantly different desires for this item - may need discussion.`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Analyze a menu for conflicts
 * Returns array of all detected conflicts
 */
export function analyzeMenuConflicts(menuData: MenuData_2_0): ResponseConflict[] {
  if (!isSchema2_0(menuData)) {
    console.warn('Conflict detection only works with schema 2.0 menus');
    return [];
  }

  const allConflicts: ResponseConflict[] = [];

  menuData.menu.forEach((category) => {
    category.items.forEach((item) => {
      // Detect desire-boundary conflicts within each person
      const desireBoundaryConflicts = detectDesireBoundaryConflicts(
        item,
        category.name,
        menuData.people
      );
      allConflicts.push(...desireBoundaryConflicts);

      // Detect interpersonal conflicts between people
      const interpersonalConflicts = detectInterpersonalConflicts(
        item,
        category.name,
        menuData.people
      );
      allConflicts.push(...interpersonalConflicts);
    });
  });

  return allConflicts;
}

/**
 * Get conflicts grouped by severity
 */
export function groupConflictsBySeverity(conflicts: ResponseConflict[]): {
  errors: ResponseConflict[];
  warnings: ResponseConflict[];
} {
  return {
    errors: conflicts.filter(c => c.severity === 'error'),
    warnings: conflicts.filter(c => c.severity === 'warning')
  };
}

/**
 * Get conflicts for a specific person
 */
export function getConflictsForPerson(
  conflicts: ResponseConflict[],
  personId: string
): ResponseConflict[] {
  return conflicts.filter(c => c.personIds.includes(personId));
}

/**
 * Get count of conflicts by type
 */
export function getConflictsSummary(conflicts: ResponseConflict[]): {
  total: number;
  errors: number;
  warnings: number;
  byType: Record<string, number>;
} {
  const grouped = groupConflictsBySeverity(conflicts);

  const byType: Record<string, number> = {};
  conflicts.forEach(c => {
    byType[c.type] = (byType[c.type] || 0) + 1;
  });

  return {
    total: conflicts.length,
    errors: grouped.errors.length,
    warnings: grouped.warnings.length,
    byType
  };
}
