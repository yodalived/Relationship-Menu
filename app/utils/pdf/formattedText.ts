import jsPDF from 'jspdf';
import { RichTextJSONPart } from '../../types';
import { computeTextWidthWithEmojis, drawTextWithEmojis } from './emojiText';

type RunFormat = {
  bold?: boolean | null;
  italic?: boolean | null;
  underline?: boolean | null;
  strikethrough?: boolean | null;
  color?: string | null;
};

type Token = {
  text: string; // may be a word, spaces, or "\n"
  fmt: RunFormat;
};

function hexToRgb(hex?: string | null): [number, number, number] | null {
  if (!hex) return null;
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function selectPdfFont(pdf: jsPDF, fmt: RunFormat) {
  let style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
  const isBold = !!fmt.bold;
  const isItalic = !!fmt.italic;
  if (isBold && isItalic) style = 'bolditalic';
  else if (isBold) style = 'bold';
  else if (isItalic) style = 'italic';
  pdf.setFont('Nunito', style);
}

function tokenizeRuns(runs: RichTextJSONPart[] | null | undefined): Token[] {
  if (!runs || runs.length === 0) return [];
  const tokens: Token[] = [];

  for (const part of runs) {
    const fmt: RunFormat = {
      bold: !!part.bold,
      italic: !!part.italic,
      underline: !!part.underline,
      strikethrough: !!part.strikethrough,
      color: part.color || null,
    };

    const paragraphs = String(part.text ?? '').split('\n');
    paragraphs.forEach((para, pIdx) => {
      const words = para.trim().length === 0 ? [] : para.trim().split(/\s+/);
      words.forEach((w, wIdx) => {
        tokens.push({ text: w, fmt });
        // insert single space token between words (we merge later)
        if (wIdx < words.length - 1) {
          tokens.push({ text: ' ', fmt });
        }
      });
      // Paragraph boundary: represented implicitly by line splitting; do not insert tokens.
      if (pIdx < paragraphs.length - 1) {
        // No-op: actual line breaks are handled by upstream line computation
      }
    });
  }

  return tokens;
}

export function createRichTextLineTokenizer(runs: RichTextJSONPart[] | null | undefined) {
  const tokens = tokenizeRuns(runs);
  let index = 0; // position in tokens array

  function takeForLine(line: string): Token[] {
    // blank line: do not consume tokens
    if (!line || line.trim().length === 0) return [];
    const targetWords = line.split(/\s+/).length;
    const collected: Token[] = [];
    let wordsTaken = 0;
    while (index < tokens.length && wordsTaken < targetWords) {
      const t = tokens[index++];
      collected.push(t);
      if (t.text !== ' ' && (index >= tokens.length || tokens[index]?.text === ' ' || wordsTaken + 1 <= targetWords)) {
        // Count words by non-space tokens
        if (t.text !== ' ') wordsTaken++;
      }
    }
    // Ensure there are exactly targetWords words: trim any trailing space tokens
    while (collected.length > 0 && collected[collected.length - 1].text === ' ') {
      collected.pop();
    }
    return collected;
  }

  return { takeForLine };
}

export function drawFormattedLineWithEmojis(
  pdf: jsPDF,
  segments: Token[],
  x: number,
  y: number,
  defaultColor: [number, number, number]
) {
  if (segments.length === 0) return;

  // Merge adjacent tokens with identical formatting, rebuilding text including spaces
  const merged: Token[] = [];
  for (const t of segments) {
    const last = merged[merged.length - 1];
    if (last && shallowFmtEqual(last.fmt, t.fmt)) {
      last.text += t.text;
    } else {
      merged.push({ text: t.text, fmt: t.fmt });
    }
  }

  let cursorX = x;
  merged.forEach(seg => {
    // Apply font and color
    selectPdfFont(pdf, seg.fmt);
    const rgb = hexToRgb(seg.fmt.color) || defaultColor;
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

    // Draw the text chunk (with emojis handled inside)
    drawTextWithEmojis(pdf, seg.text, cursorX, y);
    const segWidth = computeTextWidthWithEmojis(pdf, seg.text);

    // Decorations
    const textHeight = getCurrentTextHeight(pdf);
    if (seg.fmt.underline) {
      const underlineY = y + Math.max(0.6, textHeight * 0.08);
      const thickness = Math.max(0.3, textHeight * 0.06);
      pdf.setLineWidth(thickness);
      pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
      pdf.line(cursorX, underlineY, cursorX + segWidth, underlineY);
    }
    if (seg.fmt.strikethrough) {
      const strikeY = y - textHeight * 0.25;
      const thickness = Math.max(0.3, textHeight * 0.06);
      pdf.setLineWidth(thickness);
      pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
      pdf.line(cursorX, strikeY, cursorX + segWidth, strikeY);
    }

    cursorX += segWidth;
  });
}

function shallowFmtEqual(a: RunFormat, b: RunFormat): boolean {
  return !!a.bold === !!b.bold && !!a.italic === !!b.italic && !!a.underline === !!b.underline && !!a.strikethrough === !!b.strikethrough && (a.color || null) === (b.color || null);
}

function getCurrentTextHeight(pdf: jsPDF): number {
  // jsPDF getTextDimensions('Hg') heuristic; fallback to 5mm if missing
  try {
    const dims = (pdf as unknown as { getTextDimensions?: (t: string) => { h: number } }).getTextDimensions?.('Hg');
    if (dims && typeof dims.h === 'number') return dims.h;
  } catch {
    // ignore
  }
  return 5;
}

// --- Rich run-aware wrapping helpers ---

function setFontForFormat(pdf: jsPDF, fmt: RunFormat) {
  let style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
  if (fmt.bold && fmt.italic) style = 'bolditalic';
  else if (fmt.bold) style = 'bold';
  else if (fmt.italic) style = 'italic';
  pdf.setFont('Nunito', style);
}

function tokenizeRunsPreserveSpacesAndNewlines(runs: RichTextJSONPart[] | null | undefined): Token[] {
  if (!runs || runs.length === 0) return [];
  const tokens: Token[] = [];
  for (const part of runs) {
    const fmt: RunFormat = { bold: !!part.bold, italic: !!part.italic, underline: !!part.underline, strikethrough: !!part.strikethrough, color: part.color || null };
    const text = String(part.text ?? '');
    // First split by newlines, preserving them
    const lines = text.split(/(\n)/);
    for (const seg of lines) {
      if (seg.length === 0) continue;
      if (seg === '\n') {
        tokens.push({ text: '\n', fmt });
      } else {
        // Split non-newline segment preserving spaces
        const pieces = seg.split(/(\s+)/);
        for (const piece of pieces) {
          if (piece.length === 0) continue;
          tokens.push({ text: piece, fmt });
        }
      }
    }
  }
  return tokens;
}

function measureTokenWidth(pdf: jsPDF, token: Token): number {
  if (token.text === '\n') return 0;
  setFontForFormat(pdf, token.fmt);
  return computeTextWidthWithEmojis(pdf, token.text);
}

export function wrapRichTextToLines(
  pdf: jsPDF,
  runs: RichTextJSONPart[] | null | undefined,
  maxWidth: number
): Token[][] {
  // Newline-aware tokens
  const tokensNl = tokenizeRunsPreserveSpacesAndNewlines(runs);
  const lines: Token[][] = [];
  let current: Token[] = [];
  let currentWidth = 0;

  const pushLine = () => {
    // Trim leading spaces on the line
    while (current.length && /^\s+$/.test(current[0].text)) current.shift();
    // Trim trailing spaces
    while (current.length && /^\s+$/.test(current[current.length - 1].text)) current.pop();
    lines.push(current);
    current = [];
    currentWidth = 0;
  };

  for (const token of tokensNl) {
    if (token.text === '\n') {
      // Hard line break: commit current line and start new one
      pushLine();
      continue;
    }
    const isSpace = /^\s+$/.test(token.text);
    const tokWidth = measureTokenWidth(pdf, token);
    const willOverflow = currentWidth + tokWidth > maxWidth && current.length > 0;
    if (willOverflow) {
      pushLine();
      // Avoid starting a new line with a space
      if (!isSpace) {
        current.push(token);
        currentWidth = tokWidth;
      }
    } else {
      // If line is empty, skip leading spaces
      if (!(current.length === 0 && isSpace)) {
        current.push(token);
        currentWidth += tokWidth;
      }
    }
  }
  if (current.length > 0) pushLine();
  if (lines.length === 0) lines.push([]);
  return lines;
}

export function computeLineWidthFromSegments(pdf: jsPDF, segments: Token[]): number {
  let w = 0;
  for (const seg of segments) {
    setFontForFormat(pdf, seg.fmt);
    w += computeTextWidthWithEmojis(pdf, seg.text);
  }
  return w;
}


