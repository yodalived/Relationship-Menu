import { MenuData } from '../../../types';
import { ToastType } from '../../../components/ui/Toast/ToastContext';
import { createShareableUrl, copyToClipboard } from '../../../utils/urlProcessor';

export type ExportHandlerProps = {
  menuData: MenuData;
  editedData: MenuData;
  isEditing: boolean;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

/**
 * Creates handlers for exporting and sharing the menu
 */
export function createExportHandlers({
  menuData,
  editedData,
  isEditing,
  showToast
}: ExportHandlerProps) {
  /**
   * Download the menu as a JSON file
   */
  const handleJSONDownload = () => {
    const currentData = isEditing ? editedData : menuData;
    const { people } = currentData;
    
    // Create a blob with the JSON data
    const jsonString = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename from people's names
    const peopleNames = people.length > 0 ? 
      people.join('_').replace(/\s+/g, '_') : 
      'relationship_menu';
    
    a.download = `${peopleNames}_menu_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showToast('JSON downloaded successfully!', 'success');
  };

  /**
   * Export the menu as a PDF
   */
  const handleExportPDF = async () => {
    try {
      // Get the current menu data
      const currentData = isEditing ? editedData : menuData;
      const { people } = currentData;
      
      // Get the PDF generation function dynamically to avoid bundling PDF.js with the main chunk
      const { generateMenuPDF } = await import('../../../utils/pdf');
      
      // Generate the PDF file
      const pdfBlob = await generateMenuPDF(currentData);
      
      // Create a download link and trigger the download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      
      // Create filename from people's names
      const peopleNames = people.length > 0 ? 
        people.join('_').replace(/\s+/g, '_') : 
        'relationship_menu';
      
      a.download = `${peopleNames}_menu_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast('PDF exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showToast('Failed to export PDF', 'error');
    }
  };

  /**
   * Copy a link to the menu to the clipboard
   */
  const handleCopyLink = async () => {
    try {
      const currentData = isEditing ? editedData : menuData;
      
      // Use the utility function to create the shareable URL
      const url = await createShareableUrl(currentData);
      
      // Use the utility function to copy to clipboard
      const result = await copyToClipboard(url);
      
      if (result.success) {
        showToast('Link copied to clipboard!', 'success');
      } else {
        showToast(result.error || 'Failed to copy link', 'error');
      }
    } catch (error) {
      console.error('Error creating or copying share link:', error);
      showToast('Failed to create or copy share link', 'error');
    }
  };

  return {
    handleJSONDownload,
    handleExportPDF,
    handleCopyLink
  };
} 