import { PDFDocument, PDFName, PDFDict, PDFArray, PDFHexString, PDFString, PDFStream, decodePDFRawStream, PDFRawStream } from 'pdf-lib';
import { MenuData } from '../../types';
import { migrateMenuData } from '../migrations';

/**
 * Extract attachments from PDF document
 */
export const extractAttachments = (pdfDoc: PDFDocument) => {
  // Check if the PDF has Names catalog and EmbeddedFiles
  if (!pdfDoc.catalog.has(PDFName.of('Names'))) return [];
  const Names = pdfDoc.catalog.lookup(PDFName.of('Names'), PDFDict);

  if (!Names.has(PDFName.of('EmbeddedFiles'))) return [];
  const EmbeddedFiles = Names.lookup(PDFName.of('EmbeddedFiles'), PDFDict);

  if (!EmbeddedFiles.has(PDFName.of('Names'))) return [];
  const EFNames = EmbeddedFiles.lookup(PDFName.of('Names'), PDFArray);

  const attachments = [];
  
  for (let idx = 0, len = EFNames.size(); idx < len; idx += 2) {
    try {
      const fileName = EFNames.lookup(idx) as PDFHexString | PDFString;
      const fileSpec = EFNames.lookup(idx + 1, PDFDict);
      
      // Get the stream that contains the file data
      const stream = fileSpec
        .lookup(PDFName.of('EF'), PDFDict)
        .lookup(PDFName.of('F'), PDFStream) as PDFRawStream;
        
      attachments.push({
        name: fileName.decodeText(),
        data: decodePDFRawStream(stream).decode()
      });
    } catch (err) {
      console.error('Error extracting attachment:', err);
    }
  }

  return attachments;
};

/**
 * Extract menu data from a PDF file
 * @returns The extracted MenuData or null if no valid data found
 */
export const extractMenuDataFromPDF = async (pdfBytes: ArrayBuffer): Promise<MenuData | null> => {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Extract attachments
    const attachments = extractAttachments(pdfDoc);
    
    // Look for the relationship menu JSON file
    const menuAttachment = attachments.find(attachment => 
      attachment.name === 'relationshipmenu.json'
    );
    
    if (menuAttachment) {
      try {
        // Parse the JSON data from the attachment
        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(menuAttachment.data);
        const menuData = JSON.parse(jsonString) as MenuData;
        
        // Validate the data structure
        if (!menuData.last_update || !Array.isArray(menuData.people) || !Array.isArray(menuData.menu)) {
          throw new Error('Invalid menu data structure in the PDF');
        }
        
        // Migrate data to latest schema version (may throw if newer schema than supported)
        return migrateMenuData(menuData);
      } catch (jsonError) {
        // Re-throw so callers can show a meaningful error (e.g., newer schema)
        throw jsonError as Error;
      }
    }
    
    return null;
  } catch (err) {
    console.error('Error processing PDF:', err);
    return null;
  }
}; 