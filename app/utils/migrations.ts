import { v4 as uuidv4 } from 'uuid';
import { MenuData } from '../types';

// Current schema version - update this when adding new migrations
export const CURRENT_SCHEMA_VERSION = "1.2";

// Migration functions map each version to a function that upgrades to the next version
const migrations: {
  [key: string]: (data: MenuData) => MenuData;
} = {
  // Migrate from 1.0 to 1.1 (adds UUID)
  '1.0': (data: MenuData): MenuData => {
    console.log('Migrating from 1.0 to 1.1');
    return {
      ...data,
      uuid: uuidv4(),
      schema_version: "1.1"
    };
  },
  // Handle special case where schema_version is stored as number 1
  '1': (data: MenuData): MenuData => {
    console.log('Migrating from 1 to 1.1');
    return {
      ...data,
      uuid: uuidv4(),
      schema_version: "1.1"
    };
  },
  // Migrate from 1.1 to 1.2 (uppercase UUID, add language default 'en')
  '1.1': (data: MenuData): MenuData => {
    console.log('Migrating from 1.1 to 1.2');
    const uppercaseUuid = data.uuid ? String(data.uuid).toUpperCase() : uuidv4().toUpperCase();
    return {
      ...data,
      uuid: uppercaseUuid,
      schema_version: "1.2",
      language: data.language ?? 'en',
    };
  },
  // Add future migrations here, e.g.:
  // '1.1': (data: MenuData): MenuData => { ... }
};

// Helper to compare version strings
function compareVersions(v1: string, v2: string): number {
  const v1Parts = String(v1).split('.').map(Number);
  const v2Parts = String(v2).split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }
  
  return 0;
}

// Main migration function
export function migrateMenuData(data: MenuData): MenuData {
  // Make a deep copy of the data to avoid modifying the original
  let migratedData = JSON.parse(JSON.stringify(data));
  
  // If no schema_version is present, assume it's "1.0"
  if (!migratedData.schema_version) {
    migratedData.schema_version = "1.0";
  }
  
  // Convert schema_version to string for consistency
  let currentVersion = String(migratedData.schema_version);
  
  // If already at latest version, return as is
  if (currentVersion === CURRENT_SCHEMA_VERSION) {
    return migratedData;
  }

  console.log(`Starting migration from version ${currentVersion} to ${CURRENT_SCHEMA_VERSION}`);
  
  // Apply migrations sequentially until we reach the target version
  while (compareVersions(currentVersion, CURRENT_SCHEMA_VERSION) < 0) {
    // Find the migration function for the current version
    const migrationFn = migrations[currentVersion];
    
    if (!migrationFn) {
      console.warn(`No migration found for version ${currentVersion}. Stopping migration process.`);
      break;
    }
    
    console.log(`Applying migration from ${currentVersion}`);
    migratedData = migrationFn(migratedData);
    
    // Update the current version after migration
    currentVersion = String(migratedData.schema_version);
    console.log(`Migration step complete. New version: ${currentVersion}`);
    
    // Safety check to prevent infinite loops
    if (migrations[currentVersion] === undefined && compareVersions(currentVersion, CURRENT_SCHEMA_VERSION) < 0) {
      console.warn(`No further migrations available for version ${currentVersion}`);
      break;
    }
  }

  console.log(`Migration complete. Final version: ${migratedData.schema_version}`);
  // Final normalization to enforce current schema invariants even if input claims to be current
  if (CURRENT_SCHEMA_VERSION === '1.2') {
    // Ensure uuid exists and is uppercase
    if (!migratedData.uuid) {
      migratedData.uuid = uuidv4().toUpperCase();
    } else {
      migratedData.uuid = String(migratedData.uuid).toUpperCase();
    }
    // Ensure language exists
    if (!migratedData.language) {
      migratedData.language = 'en';
    }
    migratedData.schema_version = '1.2';
  }

  return migratedData;
}