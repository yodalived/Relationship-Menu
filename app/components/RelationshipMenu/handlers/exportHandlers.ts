import { MenuData } from '../../../types';
import { ToastType } from '../../../components/ui/Toast/ToastContext';
import { formatPeopleNames } from '../../../utils/formatUtils';

export type ExportHandlerProps = {
  menuData: MenuData;
  editedData: MenuData;
  isEditing: boolean;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

/**
 * Check if the device is a mobile device
 */
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if the Web Share API is available
 */
const isShareApiSupported = () => {
  return typeof navigator !== 'undefined' && 
         typeof navigator.share === 'function' && 
         typeof navigator.canShare === 'function';
};

/**
 * Creates a consistent title or filename 
 */
const getMenuName = (people: string[], options: { 
  extension?: string; 
  sanitizeForFilename?: boolean;
} = {}): string => {
  // Default options
  const { extension = '', sanitizeForFilename = false } = options;
  
  // Ensure there's at least one name, defaulting to "Anonymous" if empty
  const validPeople = people.length > 0 ? people : ['Anonymous'];
  
  // Format people names
  const peopleNames = formatPeopleNames(validPeople);
  
  // Format the date (using parentheses)
  const date = new Date().toISOString().split('T')[0];
  
  // Create the title/filename
  let result = `Relationship Menu for ${peopleNames} (${date})${extension}`;
  
  // Replace invalid filename characters if needed
  if (sanitizeForFilename) {
    result = result.replace(/[\/\\:*?"<>|]/g, '-');
  }
  
  return result;
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
  const handleJSONDownload = async () => {
    const currentData = isEditing ? editedData : menuData;
    const { people } = currentData;
    
    // Create a blob with the JSON data
    const jsonString = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create filename with consistent format
    const fileName = getMenuName(people, { extension: '.json', sanitizeForFilename: true });

    // Use Share API on mobile if available
    if (isMobile() && isShareApiSupported()) {
      try {
        const file = new File([blob], fileName, { type: 'application/json' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: getMenuName(people),
            text: 'The relationship menu json file can be imported and edited on https://relationshipmenu.org'
          });
          showToast('JSON shared successfully!', 'success');
        } else {
          // Fallback to download if sharing files not supported
          downloadFile(blob,  fileName);
        }
      } catch (error) {
        // Do nothing if user aborted the share dialog
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        // Log and fallback to download on other errors
        console.error('Error sharing JSON:', error);
        downloadFile(blob, fileName);
      }
    } else {
      // Regular download for desktop
      downloadFile(blob, fileName);
    }
  };

  /**
   * Helper function to download a file
   */
  const downloadFile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    showToast('File downloaded successfully!', 'success');
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
      
      // Create filename with consistent format
      const fileName = getMenuName(people, { extension: '.pdf', sanitizeForFilename: true });
      
      // Use Share API on mobile if available
      if (isMobile() && isShareApiSupported()) {
        try {
          const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: getMenuName(people),
              text: 'The relationship menu PDF file can be imported and edited on https://relationshipmenu.org or viewed directly.'
            });
            showToast('PDF shared successfully!', 'success');
          } else {
            // Fallback to download if sharing files not supported
            downloadFile(pdfBlob, fileName);
          }
        } catch (error) {
          // Do nothing if user aborted the share dialog
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }
          // Log and fallback to download on other errors
          console.error('Error sharing PDF:', error);
          downloadFile(pdfBlob, fileName);
        }
      } else {
        // Regular download for desktop
        downloadFile(pdfBlob, fileName);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showToast('Failed to export PDF', 'error');
    }
  };

  return {
    handleJSONDownload,
    handleExportPDF
  };
} 