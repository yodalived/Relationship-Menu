import { MenuData } from '../../../types';

export type DataHandlerProps = {
  editedData: MenuData;
  setEditedData: (data: MenuData) => void;
  onSave: (data: MenuData) => void;
  setActiveIconPicker?: (picker: { catIndex: number; itemIndex: number } | null) => void;
};

/**
 * Creates handlers for updating menu data
 */
export function createDataHandlers({
  editedData,
  setEditedData,
  onSave,
  setActiveIconPicker
}: DataHandlerProps) {
  /**
   * Update a note for a menu item
   */
  const handleNoteChange = (catIndex: number, itemIndex: number, newNote: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].note = newNote || null;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Update an icon for a menu item
   */
  const handleIconChange = (catIndex: number, itemIndex: number, newIcon: string | null) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].icon = newIcon;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
    
    if (setActiveIconPicker) {
      setActiveIconPicker(null); // Close the picker after selection
    }
  };

  /**
   * Update a category name
   */
  const handleCategoryNameChange = (catIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].name = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Update a person's name
   */
  const handlePersonNameChange = (personIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.people[personIndex] = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Update a menu item's name
   */
  const handleItemNameChange = (catIndex: number, itemIndex: number, newName: string) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].name = newName;
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Add a new person to the menu
   */
  const handleAddPerson = () => {
    const updatedData = { ...editedData };
    updatedData.people.push("New Person");
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Remove a person from the menu
   */
  const handleDeletePerson = (personIndex: number) => {
    const updatedData = { ...editedData };
    // Ensure we maintain at least 2 people
    if (updatedData.people.length <= 2) {
      alert("A relationship menu must have at least 2 people.");
      return;
    }
    updatedData.people.splice(personIndex, 1);
    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  return {
    handleNoteChange,
    handleIconChange,
    handleCategoryNameChange,
    handlePersonNameChange,
    handleItemNameChange,
    handleAddPerson,
    handleDeletePerson
  };
} 