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
  schema_version: string;
  last_update: string;
  people: string[];
  menu: MenuCategory[];
  uuid: string; // Required UUID field (version 1.1+)
  language: string; // Required language for v1.2+
  template_uuid?: string | null; // Optional: UUID of template used to create the menu (v1.2+)
};

// Define available menu modes
export type MenuMode = 'view' | 'fill' | 'edit'; 