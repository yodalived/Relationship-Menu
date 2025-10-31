// Rich text representation part (single run)
export type RichTextJSONPart = {
  text: string;
  bold?: boolean | null;
  italic?: boolean | null;
  underline?: boolean | null;
  strikethrough?: boolean | null;
  color?: string | null; // Hex color, e.g. "#RRGGBB"
};

// Define menu item type (union of current and future schema)
// For backward compatibility during migration period
export type MenuItem = MenuItem_1_3 | MenuItem_2_0;

// Define menu category type (union type)
export type MenuCategory = MenuCategory_1_3 | MenuCategory_2_0;

// Define main menu data type (union type)
// This allows the app to work with both schema versions
export type MenuData = MenuData_1_3 | MenuData_2_0;

// Helper type guards to check schema version
export function isSchema2_0(data: MenuData): data is MenuData_2_0 {
  return data.schema_version === '2.0';
}

export function isSchema1_3(data: MenuData): data is MenuData_1_3 {
  return data.schema_version === '1.3';
}

// Helper to check if people array contains Person objects or strings
export function hasPeopleWithIds(data: MenuData): data is MenuData_2_0 {
  return isSchema2_0(data) &&
         data.people.length > 0 &&
         typeof data.people[0] === 'object' &&
         'id' in data.people[0];
}

// Define available menu modes
export type MenuMode = 'view' | 'fill' | 'edit'; 

// Legacy schema types for migrations
export type LegacyMenuItem_1_2 = {
  name: string;
  note?: string | null;
  icon?: string | null;
};

export type LegacyMenuCategory_1_2 = {
  name: string;
  items: LegacyMenuItem_1_2[];
};

export type MenuData_1_2 = {
  schema_version: '1.2';
  last_update: string;
  people: string[];
  menu: LegacyMenuCategory_1_2[];
  uuid?: string; // may be missing or lowercase in 1.2
  language?: string; // optional in 1.2
  template_uuid?: string | null;
};

// ============= Schema 2.0 Types =============

// Person with unique ID to prevent duplicate name conflicts
export type Person = {
  id: string;       // UUID for unique identification
  name: string;     // Display name (can have duplicates)
  color?: string;   // Optional: Hex color for UI differentiation
  avatar?: string;  // Optional: Emoji or initials for visual identification
};

// Schema 2.0 desire values (what someone wants)
export type DesireValue =
  | 'must'         // Essential, need this
  | 'like'         // Would like to have this
  | 'maybe'        // Uncertain, open to exploration
  | 'prefer-not'   // Would rather not
  | 'off-limit'    // Do not want this
  | null;          // Not yet answered

// Schema 2.0 boundary values (what someone is comfortable with)
export type BoundaryValue =
  | 'enthusiastic'    // Actively want this, well within bounds
  | 'comfortable'     // Within my comfort zone
  | 'soft-boundary'   // Willing to stretch, but needs discussion
  | 'hard-boundary'   // This crosses my limits
  | null;             // Not yet answered

// Person's response with both desire and boundary
export type PersonResponse = {
  desire: DesireValue;
  boundary: BoundaryValue;
  note?: string | null;         // Optional: Context for this specific response
  last_updated?: string | null; // Optional: ISO timestamp for tracking changes
};

// Map of person IDs to their responses
export type ItemResponses = {
  [personId: string]: PersonResponse;
};

// Schema 2.0 MenuItem with per-person responses
export type MenuItem_2_0 = {
  name: string;
  note?: RichTextJSONPart[] | null;  // General note about the item
  responses?: ItemResponses;         // NEW in 2.0: Per-person responses
  icon?: string | null;              // DEPRECATED in 2.0: Kept for migration only
};

// Schema 2.0 MenuCategory
export type MenuCategory_2_0 = {
  name: string;
  items: MenuItem_2_0[];
};

// Schema 2.0 MenuData
export type MenuData_2_0 = {
  schema_version: '2.0';
  last_update: string;
  people: Person[];                   // Changed from string[] to Person[]
  menu: MenuCategory_2_0[];
  uuid: string;
  language: string;
  template_uuid?: string | null;
};

// Legacy schema 1.3 types for migration (current production schema)
export type MenuItem_1_3 = {
  name: string;
  note?: RichTextJSONPart[] | null;
  icon?: string | null;
};

export type MenuCategory_1_3 = {
  name: string;
  items: MenuItem_1_3[];
};

export type MenuData_1_3 = {
  schema_version: '1.3' | string;  // Allow string for flexibility
  last_update: string;
  people: string[];
  menu: MenuCategory_1_3[];
  uuid: string;
  language: string;
  template_uuid?: string | null;
};

// Conflict detection types
export type ConflictType = 'desire-boundary' | 'interpersonal' | 'compatibility';

export type ResponseConflict = {
  type: ConflictType;
  severity: 'warning' | 'error';
  itemName: string;
  categoryName: string;
  personIds: string[];
  description: string;
};