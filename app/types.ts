// Define menu item type
export type MenuItem = {
  name: string;
  note?: string | null;
  icon?: string | null;
};

// Define menu category type
export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

// Define main menu data type
export type MenuData = {
  schema_version: string | number;
  last_update: string;
  people: string[];
  menu: MenuCategory[];
}; 