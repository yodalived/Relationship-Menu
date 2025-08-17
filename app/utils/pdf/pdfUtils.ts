import jsPDF from 'jspdf';
import { COLORS, PDF_CONFIG } from './constants';
import { ColorTypes } from './types';

/**
 * Draws an icon for a menu item
 */
export function drawIcon(pdf: jsPDF, iconType: string | null, x: number, y: number, size: number): void {
  // Default to "not set" if no icon is specified
  const iconKey = iconType || 'notSet';
  
  // Get the icon colors, with fallback to notSet if the icon type doesn't exist
  const iconColor = iconKey in COLORS 
    ? (COLORS as ColorTypes)[iconKey] 
    : COLORS.notSet;
  
  const bgColor = 'bg' in iconColor ? iconColor.bg : COLORS.notSet.bg;
  const borderColor = 'border' in iconColor ? iconColor.border : COLORS.notSet.border;
  
  // Set scale factor based on size (20 is reference for curves)
  const scale = size / 20;
  const centerX = x + size/2;
  
  // Use provided Y coordinate as center point for icon positioning
  const centerY = y;
  
  // Set line settings
  pdf.setLineWidth(1.5 * scale);
  pdf.setLineCap('round');
  pdf.setLineJoin('round');
  
  // Draw colored background circle for all status icons
  if (iconType !== 'notSet' && iconType !== 'not-set' && iconType !== null && iconType !== undefined && iconType !== '') {
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.circle(centerX, centerY, 9 * scale, 'F');
  }

  // Draw icon symbol on top of background
  switch(iconType) {
    case 'like':
      // Checkmark symbol
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(2.4 * scale);
      pdf.setLineCap('round');
      pdf.setLineJoin('round');
      // Checkmark path
      pdf.line(centerX - 3.5 * scale, centerY, centerX - 1 * scale, centerY + 2.5 * scale);
      pdf.line(centerX - 1 * scale, centerY + 2.5 * scale, centerX + 3.5 * scale, centerY - 2.5 * scale);
      break;
      
    case 'maybe':
      // Question mark symbol
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(2.4 * scale);
      pdf.setLineCap('round');
      pdf.setLineJoin('round');
      
      // Question mark path coordinates
      const pts = [
        [centerX - 3 * scale, centerY - 2.5 * scale],
        [centerX - 2.4 * scale, centerY - 3.5 * scale],
        [centerX - 1.3 * scale, centerY - 4.2 * scale],
        [centerX, centerY - 4.2 * scale],
        [centerX + 1.3 * scale, centerY - 4.2 * scale],
        [centerX + 2.4 * scale, centerY - 3.5 * scale],
        [centerX + 3 * scale, centerY - 2.5 * scale],
        [centerX + 2.4 * scale, centerY - 1.5 * scale],
        [centerX + 1.3 * scale, centerY - 0.8 * scale],
        [centerX, centerY],
        [centerX, centerY + 1.5 * scale]
      ];
      
      for (let i = 0; i < pts.length - 1; i++) {
        pdf.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      }
      
      // Question mark dot
      pdf.setFillColor(255, 255, 255);
      pdf.circle(centerX, centerY + 4.5 * scale, 1.2 * scale, 'F');
      break;
      
    case 'must':
      // Exclamation mark symbol
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(2.4 * scale);
      pdf.setLineCap('round');
      // Exclamation line
      pdf.line(centerX, centerY - 4 * scale, centerX, centerY + 0.5 * scale);
      // Dot
      pdf.setFillColor(255, 255, 255);
      pdf.circle(centerX, centerY + 3.2 * scale, 1.2 * scale, 'F');
      break;
      
    case 'prefer-not':
      // Minus sign symbol
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(3 * scale);
      pdf.setLineCap('round');
      pdf.line(centerX - 3.5 * scale, centerY, centerX + 3.5 * scale, centerY);
      break;
      
    case 'off-limit':
      // X symbol
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(2.4 * scale);
      pdf.setLineCap('round');
      pdf.line(centerX - 3 * scale, centerY - 3 * scale, centerX + 3 * scale, centerY + 3 * scale);
      pdf.line(centerX + 3 * scale, centerY - 3 * scale, centerX - 3 * scale, centerY + 3 * scale);
      break;
      
    case 'talk':
      // Speech bubble symbol
      pdf.setFillColor(255, 255, 255);
      const bubbleW = 12 * scale;
      const bubbleH = 7.5 * scale;
      
      // Speech bubble body
      pdf.roundedRect(centerX - bubbleW/2, centerY - bubbleH/2, bubbleW, bubbleH, 2 * scale, 2 * scale, 'F');
      
      // Speech bubble tail
      pdf.triangle(centerX + 1.5 * scale, centerY + bubbleH/2,
                   centerX + 0.2 * scale, centerY + bubbleH/2 + 2 * scale,
                   centerX - 0.5 * scale, centerY + bubbleH/2,
                   'F');
      break;
      
    case 'notSet':
    case 'not-set':
    case null:
    case undefined:
    case '':
      // Small bullet point for unset items
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      pdf.circle(centerX, centerY, 2.5 * scale, 'F');
      break;
      
    default:
      // Default bullet point for unknown icons
      pdf.setFillColor(158, 158, 158); // Use notSet gray color
      pdf.circle(centerX, centerY, 2.5 * scale, 'F');
      break;
  }
}

/**
 * Creates a marker/highlight box around an item
 */
export function createItemMarker(pdf: jsPDF, iconType: string | null, x: number, y: number, width: number, height: number): void {
  // Default to "not set" if no icon is specified
  const iconKey = iconType || 'notSet';
  
  // Get the marker color, with fallback to transparent if the icon type doesn't exist
  const iconColor = iconKey in COLORS 
    ? (COLORS as ColorTypes)[iconKey] 
    : COLORS.notSet;
  
  // Only draw marker if the icon is not "notSet"
  if (iconKey !== 'notSet') {
    const markerColor = 'marker' in iconColor ? iconColor.marker : COLORS.notSet.marker;
    
    // Calculate marker dimensions based on text width
    const horizontalPadding = PDF_CONFIG.markerHorizontalPadding;
    const verticalPadding = PDF_CONFIG.markerVerticalPadding;
    const markerWidth = width + (horizontalPadding * 2);
    const markerHeight = height + verticalPadding;
    const borderRadius = PDF_CONFIG.markerBorderRadius;
    
    // Draw colored background marker behind item text
    pdf.setFillColor(markerColor[0], markerColor[1], markerColor[2]);
    
    // Center marker vertically on text baseline
    const markerY = y - markerHeight/2;
    
    // Draw rounded rectangle marker
    drawRoundedRect(
      pdf, 
      x - horizontalPadding, 
      markerY, 
      markerWidth, 
      markerHeight, 
      borderRadius
    );
  }
}

/**
 * Draws a filled rounded rectangle
 */
export function drawRoundedRect(pdf: jsPDF, x: number, y: number, width: number, height: number, radius: number) {
  // Constrain radius to rectangle dimensions
  const maxRadius = Math.min(width, height) / 2;
  radius = Math.min(radius, maxRadius);
  
  // Fill only, no border
  
  // Draw filled rounded rectangle
  pdf.roundedRect(x, y, width, height, radius, radius, 'F');
}