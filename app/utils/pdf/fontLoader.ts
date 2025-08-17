import jsPDF from 'jspdf';
import { NUNITO_FONTS_COMPRESSED } from '../../../node_modules/.fonts';
import { ungzip } from 'pako';

/**
 * Helper function to decompress font data
 */
function decompressFont(compressedBase64: string): string {
  try {
    // Convert base64 back to Uint8Array
    const compressedData = Uint8Array.from(atob(compressedBase64), c => c.charCodeAt(0));
    
    // Decompress using pako
    const decompressedData = ungzip(compressedData);
    
    // Convert back to base64 for jsPDF
    return btoa(String.fromCharCode(...decompressedData));
  } catch (error) {
    console.error('Failed to decompress font:', error);
    throw error;
  }
}

/**
 * Loads Nunito fonts into jsPDF
 * This should be called for each jsPDF instance before generating any PDF
 */
export function loadNunitoFonts(pdf: jsPDF): void {
  // Check if Nunito fonts are already loaded in this instance
  const fontList = pdf.getFontList();
  if (fontList.Nunito && fontList.Nunito.includes('normal') && fontList.Nunito.includes('bold')) {
    return; // Fonts already loaded
  }
  
  try {
    // Decompress and add only the Nunito font variants we actually use
    const nunitoRegular = decompressFont(NUNITO_FONTS_COMPRESSED.normal);
    pdf.addFileToVFS('Nunito-Regular.ttf', nunitoRegular);
    pdf.addFont('Nunito-Regular.ttf', 'Nunito', 'normal');
    
    const nunitoBold = decompressFont(NUNITO_FONTS_COMPRESSED.bold);
    pdf.addFileToVFS('Nunito-Bold.ttf', nunitoBold);
    pdf.addFont('Nunito-Bold.ttf', 'Nunito', 'bold');
    
  } catch (error) {
    console.error('Failed to load Nunito fonts:', error);
    throw error;
  }
}