import { MenuData, RichTextJSONPart, isSchema2_0 } from '../../../types';
import { ToastType } from '../../ui/Toast/ToastContext';
import {
  updatePersonName,
  addPerson,
  removePerson,
  initializeResponsesForPerson,
  removeResponsesForPerson
} from '../../../utils/personUtils';

export type DataHandlerProps = {
  editedData: MenuData;
  setEditedData: (data: MenuData) => void;
  onSave: (data: MenuData) => void;
  setActiveIconPicker?: (picker: { catIndex: number; itemIndex: number } | null) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

/**
 * Creates handlers for updating menu data
 */
export function createDataHandlers({
  editedData,
  setEditedData,
  onSave,
  setActiveIconPicker,
  showToast
}: DataHandlerProps) {
  /**
   * Update a note for a menu item
   */
  const handleNoteChange = (catIndex: number, itemIndex: number, newNote: RichTextJSONPart[] | null) => {
    const updatedData = { ...editedData };
    updatedData.menu[catIndex].items[itemIndex].note = newNote;
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

    if (isSchema2_0(updatedData)) {
      // Schema 2.0: Use Person objects with IDs
      const personId = updatedData.people[personIndex].id;
      updatedData.people = updatePersonName(updatedData.people, personId, newName);
    } else {
      // Schema 1.3: Direct string array update
      updatedData.people[personIndex] = newName;
    }

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
    let updatedData = { ...editedData };

    if (isSchema2_0(updatedData)) {
      // Schema 2.0: Add Person object and initialize responses across all items
      const { people: newPeople, newPerson } = addPerson(updatedData.people, "New Person");
      updatedData.people = newPeople;
      // Initialize empty responses for the new person across all menu items
      updatedData = initializeResponsesForPerson(updatedData, newPerson.id);
    } else {
      // Schema 1.3: Direct string array update
      updatedData.people.push("New Person");
    }

    updatedData.last_update = new Date().toISOString();
    setEditedData(updatedData);
    onSave(updatedData);
  };

  /**
   * Remove a person from the menu
   */
  const handleDeletePerson = (personIndex: number) => {
    let updatedData = { ...editedData };
    // Ensure we maintain at least 1 person
    if (updatedData.people.length <= 1) {
      showToast("A relationship menu must have at least 1 person.", "error", 4000);
      return;
    }

    if (isSchema2_0(updatedData)) {
      // Schema 2.0: Remove Person object and clean up responses
      const personId = updatedData.people[personIndex].id;
      updatedData.people = removePerson(updatedData.people, personId);
      // Remove all responses for this person across all menu items
      updatedData = removeResponsesForPerson(updatedData, personId);
    } else {
      // Schema 1.3: Direct string array removal
      updatedData.people.splice(personIndex, 1);
    }

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