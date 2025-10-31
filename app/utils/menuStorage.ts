import { MenuData, Person } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { migrateMenuData } from './migrations';
import { formatPeopleNames } from './formatUtils';

// LocalStorage keys
export const MENU_ITEM_PREFIX = 'relationship_menu_';
export const LEGACY_MENU_KEY = 'relationship_menu_data'; // For migration from old format

// Menu info type
export type MenuInfo = {
  id: string;
  title: string;
  lastUpdated: string;
};

/**
 * Creates a title from people names
 * @deprecated Use formatPeopleNames from utils/formatUtils instead
 */
export function createMenuTitle(people: string[] | Person[]): string {
  if (!people || people.length === 0) return "Untitled Menu";
  return formatPeopleNames(people);
}

/**
 * Migrates data from legacy storage format to the new one
 */
export function migrateFromLegacyFormat(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const legacyData = localStorage.getItem(LEGACY_MENU_KEY);
    if (legacyData) {
      const parsedData = JSON.parse(legacyData) as MenuData;
      const migratedData = migrateMenuData(parsedData);
      
      // Ensure it has a UUID
      if (!migratedData.uuid) {
        migratedData.uuid = uuidv4();
      }
      
      // Save to new format
      saveMenu(migratedData);
      
      // Remove the legacy data
      localStorage.removeItem(LEGACY_MENU_KEY);
    }
  } catch (error) {
    console.error('Error migrating legacy data:', error);
  }
}

/**
 * Gets all menus by scanning localStorage
 */
export function getAllMenus(): MenuInfo[] {
  // Run migration before getting menus
  migrateFromLegacyFormat();
  
  const menus: MenuInfo[] = [];
  
  if (typeof window === 'undefined') return menus;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(MENU_ITEM_PREFIX)) {
        try {
          const menuData = JSON.parse(localStorage.getItem(key) || '{}') as MenuData;
          
          if (menuData && menuData.uuid) {
            menus.push({
              id: menuData.uuid,
              title: createMenuTitle(menuData.people),
              lastUpdated: menuData.last_update
            });
          }
        } catch (err) {
          console.error('Error parsing menu data:', err);
        }
      }
    }
    
    // Sort by last updated, newest first
    menus.sort((a, b) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  } catch (error) {
    console.error('Error scanning for menus:', error);
  }
  
  return menus;
}

/**
 * Updates menu list after saving a menu
 * Returns the updated menu list
 */
export function updateMenuList(menu: MenuData): MenuInfo[] {
  if (typeof window === 'undefined' || !menu.uuid) return [];
  
  // Just get fresh list of all menus
  return getAllMenus();
}

/**
 * Loads a menu by ID
 */
export function getMenuById(id: string): MenuData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const menuKey = `${MENU_ITEM_PREFIX}${id}`;
    const storedMenu = localStorage.getItem(menuKey);
    
    if (!storedMenu) {
      return null;
    }
    
    // Parse and apply migrations to ensure up-to-date data structure
    let menuData = JSON.parse(storedMenu) as MenuData;
    menuData = migrateMenuData(menuData);
    
    return menuData;
  } catch (error) {
    console.error('Error loading menu:', error);
    return null;
  }
}

/**
 * Saves a menu to storage
 */
export function saveMenu(menu: MenuData): boolean {
  if (typeof window === 'undefined' || !menu.uuid) return false;
  
  try {
    // Always normalize to current schema before saving
    const normalized = migrateMenuData(menu);
    const menuKey = `${MENU_ITEM_PREFIX}${normalized.uuid}`;
    localStorage.setItem(menuKey, JSON.stringify(normalized));
    
    // Notify components that menu data has changed
    window.dispatchEvent(new Event('menuDataChanged'));
    
    return true;
  } catch (error) {
    console.error('Error saving menu:', error);
    return false;
  }
}

/**
 * Deletes a menu from storage
 */
export function deleteMenu(id: string): MenuInfo[] {
  if (typeof window === 'undefined') return [];
  
  try {
    // Remove from localStorage
    localStorage.removeItem(`${MENU_ITEM_PREFIX}${id}`);
    
    // Return fresh list of all menus
    return getAllMenus();
  } catch (error) {
    console.error('Error deleting menu:', error);
    return [];
  }
} 