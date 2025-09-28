import React from 'react';
import { RichTextJSONPart } from '../types';

/**
 * Converts an array of RichTextJSONPart to plain text
 * Used for editing components that need string representation
 */
export function richTextToPlainText(richText: RichTextJSONPart[] | null | undefined): string {
  if (!richText || richText.length === 0) {
    return '';
  }
  
  return richText.map(part => part.text).join('');
}

/**
 * Converts plain text to RichTextJSONPart array
 * Used when saving plain text input as rich text
 */
// Note: plainTextToRichText removed – not needed with rich text editor

/**
 * Renders rich text as JSX for display components
 * Handles formatting like bold, italic, underline, strikethrough, and color
 */
export function renderRichText(richText: RichTextJSONPart[] | null | undefined): React.ReactNode {
  if (!richText || richText.length === 0) {
    return '';
  }
  
  return (
    <>
      {richText.map((part, partIndex) => 
        renderRichTextPart(part, partIndex)
      )}
    </>
  );
}

/**
 * Renders a single rich text part with its formatting
 */
function renderRichTextPart(part: RichTextJSONPart, partIndex: number): React.ReactElement {
  // Split text by newlines to handle line breaks
  const lines = part.text.split('\n');
  
  // Build CSS styles for this part
  const styles: React.CSSProperties = {};
  
  if (part.bold) {
    styles.fontWeight = 'bold';
  }
  
  if (part.italic) {
    styles.fontStyle = 'italic';
  }
  
  // Combine text decorations
  const textDecorations: string[] = [];
  if (part.underline) {
    textDecorations.push('underline');
  }
  if (part.strikethrough) {
    textDecorations.push('line-through');
  }
  if (textDecorations.length > 0) {
    styles.textDecoration = textDecorations.join(' ');
  }
  
  if (part.color) {
    styles.color = part.color;
  }
  
  return (
    <span key={partIndex} style={styles}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}

/**
 * Checks if rich text content is empty or only whitespace
 */
export function isRichTextEmpty(richText: RichTextJSONPart[] | null | undefined): boolean {
  if (!richText || richText.length === 0) {
    return true;
  }
  
  const text = richText.map(part => part.text).join('').trim();
  return text.length === 0;
}

/**
 * Creates a rich text part with specified formatting
 * Utility function for creating formatted text programmatically
 */
// Note: createRichTextPart removed – not used by current UI

/**
 * Creates a rich text array from mixed plain and formatted text
 * Utility function for testing and development
 */
// Note: createRichText removed – only used for tests / not needed now
