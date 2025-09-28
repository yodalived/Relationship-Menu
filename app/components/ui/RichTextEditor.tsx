'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { HexColorPicker } from 'react-colorful';
import type { Node as PMNode } from '@tiptap/pm/model';
import { RichTextJSONPart } from '../../types';

interface RichTextEditorProps {
  value: RichTextJSONPart[] | null;
  onChange: (richText: RichTextJSONPart[] | null) => void;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  className = "",
  autoFocus = false,
  disabled = false
}: RichTextEditorProps) {
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable heading, lists, etc. - we just want basic formatting
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Underline,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
    ],
    content: richTextToPMDoc(value),
    editable: !disabled,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      const richText = pmDocToRichText(editor.getJSON());
      onChange(richText);
    },
  });

  // Selection-aware toolbar state
  const [allBold, setAllBold] = useState(false);
  const [allItalic, setAllItalic] = useState(false);
  const [allUnderline, setAllUnderline] = useState(false);
  const [allStrike, setAllStrike] = useState(false);

  // Update computed toolbar state on selection/content changes
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      setAllBold(isMarkActiveEverywhere(editor, 'bold'));
      setAllItalic(isMarkActiveEverywhere(editor, 'italic'));
      setAllUnderline(isMarkActiveEverywhere(editor, 'underline'));
      setAllStrike(isMarkActiveEverywhere(editor, 'strike'));
    };
    update();
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const newDoc = richTextToPMDoc(value);
      editor.commands.setContent(newDoc);
    }
  }, [value, editor]);

  // Handle auto focus
  useEffect(() => {
    if (autoFocus && editor) {
      editor.commands.focus();
    }
  }, [autoFocus, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="toolbar flex flex-wrap gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={allBold}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={allItalic}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={allUnderline}
          title="Underline"
        >
          <u>U</u>
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={allStrike}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="border-l border-gray-300 dark:border-gray-600 mx-1" />

        <InlineColorPicker editor={editor} />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetColor().run()}
          title="Remove Color"
        >
          <span className="text-gray-600 dark:text-gray-400">A</span>
        </ToolbarButton>
      </div>
      
      {/* Editor Content */}
      <div className="editor-content">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-3 min-h-[80px] focus-within:outline-none"
          style={{ 
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        />
      </div>
    </div>
  );
}

function ToolbarButton({ 
  onClick, 
  isActive = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode; 
  title?: string;
}) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`
        px-2 py-1 rounded text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
        }
        border border-gray-300 dark:border-gray-500
      `}
    >
      {children}
    </button>
  );
}

// Detect system dark mode preference; minimal and robust
function usePrefersDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);

    // Initialize on mount
    setIsDark(mql.matches);

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else {
      // Safari < 14 fallback
      // @ts-ignore
      mql.addListener(handler);
      return () => {
        // @ts-ignore
        mql.removeListener(handler);
      };
    }
  }, []);

  return isDark;
}

function InlineColorPicker({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = usePrefersDark();
  const themeDefaultColor = isDark ? '#ffffff' : '#000000';
  const [currentColor, setCurrentColor] = useState<string>(() => getCurrentColor(editor) ?? themeDefaultColor);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const isOpenRef = useRef<boolean>(false);
  const currentColorRef = useRef<string>(currentColor);
  const pointerFromPickerRef = useRef<boolean>(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  useEffect(() => {
    const handleSelection = () => {
      if (isOpenRef.current) return;
      const color = getCurrentColor(editor);
      const next = color ?? themeDefaultColor;
      if (next !== currentColorRef.current) {
        setCurrentColor(next);
      }
    };
    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor, themeDefaultColor]);

  // If theme changes while selection has no explicit color, update the swatch
  useEffect(() => {
    if (isOpenRef.current) return;
    const color = getCurrentColor(editor);
    if (!color) {
      setCurrentColor(themeDefaultColor);
    }
  }, [themeDefaultColor, editor]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!isOpen) return;
      const target = e.target as Node;
      const clickedInside = !!(containerRef.current && containerRef.current.contains(target)) || !!(buttonRef.current && buttonRef.current.contains(target));
      if (clickedInside) return;
      if (pointerFromPickerRef.current) {
        // reset flag; don't close due to drag releasing outside
        pointerFromPickerRef.current = false;
        return;
      }
      setIsOpen(false);
    }
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        ref={buttonRef}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          setIsOpen((v) => {
            const next = !v;
            if (next) {
              const { from, to } = editor.state.selection;
              selectionRef.current = { from, to };
            } else {
              selectionRef.current = null;
            }
            return next;
          });
        }}
        title="Text color"
        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 flex items-center justify-center"
      >
        <span className="w-5 h-5 rounded" style={{ backgroundColor: currentColor }} />
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-2 p-2 bg-white dark:bg-gray-700 rounded shadow-lg border border-gray-200 dark:border-gray-600"
          style={{ width: 220 }}
          onMouseDown={(e) => { e.stopPropagation(); pointerFromPickerRef.current = true; }}
          onPointerDown={(e) => { e.stopPropagation(); pointerFromPickerRef.current = true; }}
          onTouchStart={(e) => { e.stopPropagation(); }}
          onClick={(e) => e.stopPropagation()}
        >
          <HexColorPicker
            color={currentColor}
            onChange={(hex) => {
              const treatAsUnset = isNearBlackOrWhite(hex);
              setCurrentColor(treatAsUnset ? themeDefaultColor : hex);
              const saved = selectionRef.current ?? { from: editor.state.selection.from, to: editor.state.selection.to };
              if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
              rafRef.current = requestAnimationFrame(() => {
                const { from, to } = editor.state.selection;
                const needsReselect = from !== saved.from || to !== saved.to;
                const chain = editor.chain().focus();
                if (needsReselect) chain.setTextSelection({ from: saved.from, to: saved.to });
                if (treatAsUnset) {
                  chain.unsetColor().run();
                } else {
                  chain.setColor(hex).run();
                }
              });
            }}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => {
                const val = normalizeHex(e.target.value);
                const treatAsUnset = isNearBlackOrWhite(val);
                setCurrentColor(treatAsUnset ? themeDefaultColor : val);
                if (isValidHex(val)) {
                  const saved = selectionRef.current ?? { from: editor.state.selection.from, to: editor.state.selection.to };
                  const { from, to } = editor.state.selection;
                  const needsReselect = from !== saved.from || to !== saved.to;
                  const chain = editor.chain().focus();
                  if (needsReselect) chain.setTextSelection({ from: saved.from, to: saved.to });
                  if (treatAsUnset) {
                    chain.unsetColor().run();
                  } else {
                    chain.setColor(val).run();
                  }
                }
              }}
              className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100"
            />
            <button
              onMouseDown={(e) => { e.stopPropagation(); }}
              onClick={(e) => {
                e.stopPropagation();
                const saved = selectionRef.current ?? { from: editor.state.selection.from, to: editor.state.selection.to };
                const { from, to } = editor.state.selection;
                const needsReselect = from !== saved.from || to !== saved.to;
                const chain = editor.chain().focus();
                if (needsReselect) chain.setTextSelection({ from: saved.from, to: saved.to });
                chain.unsetColor().run();
                setCurrentColor(themeDefaultColor);
              }}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: check whether entire selection has mark (or caret inherits it)
function isMarkActiveEverywhere(editor: Editor, markName: string, attrs?: Record<string, unknown>): boolean {
  const { state } = editor;
  const { from, to, empty } = state.selection;
  if (empty) {
    return editor.isActive(markName, attrs);
  }
  let all = true;
  let sawText = false;
  state.doc.nodesBetween(from, to, (node: PMNode) => {
    if ((node as PMNode).isText && node.text && node.text.length > 0) {
      sawText = true;
      const has = (node.marks || []).some((m: { type: { name: string }; attrs?: Record<string, unknown> }) => {
        if (m.type.name !== markName) return false;
        if (!attrs) return true;
        return Object.entries(attrs).every(([k, v]) => (m.attrs as Record<string, unknown> | undefined)?.[k] === v);
      });
      if (!has) {
        all = false;
        return false; // stop
      }
    }
    return undefined;
  });
  return sawText ? all : false;
}

function isUniformColor(editor: Editor, color: string): boolean {
  const { state } = editor;
  const { from, to, empty } = state.selection;
  if (empty) {
    return editor.isActive('textStyle', { color });
  }
  let all = true;
  let sawText = false;
  state.doc.nodesBetween(from, to, (node: PMNode) => {
    if ((node as PMNode).isText && node.text && node.text.length > 0) {
      sawText = true;
      // Find color mark if present
      const colorMark = (node.marks || []).find(
        (m: { type: { name: string }; attrs?: Record<string, unknown> }) => m.type.name === 'textStyle' && m.attrs?.color != null
      );
      if (!colorMark || (colorMark.attrs as Record<string, unknown>).color !== color) {
        all = false;
        return false;
      }
    }
    return undefined;
  });
  return sawText ? all : false;
}

function getCurrentColor(editor: Editor): string | null {
  // If caret is inside text with color or selection has uniform color, return it
  const { state } = editor;
  const { from, to, empty } = state.selection;
  if (empty) {
    const active = editor.getAttributes('textStyle');
    const c = typeof active?.color === 'string' ? active.color : null;
    if (c && isNearBlackOrWhite(c)) return null;
    return c;
  }
  let color: string | null = null;
  let uniform = true;
  let sawText = false;
  state.doc.nodesBetween(from, to, (node: PMNode) => {
    if ((node as PMNode).isText && node.text && node.text.length > 0) {
      sawText = true;
      const mark = (node.marks || []).find((m: { type: { name: string }; attrs?: Record<string, unknown> }) => m.type.name === 'textStyle' && m.attrs?.color != null);
      const c = (mark?.attrs as Record<string, unknown> | undefined)?.color as string | undefined;
      if (color == null) {
        color = c ?? null;
      } else if (color !== (c ?? null)) {
        uniform = false;
        return false;
      }
    }
    return undefined;
  });
  if (!(sawText && uniform)) return null;
  if (color && isNearBlackOrWhite(color)) return null;
  return color;
}

function isValidHex(input: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(input);
}

function normalizeHex(input: string): string {
  const trimmed = input.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.slice(0, 7);
}

// Treat pure or near pure black/white as "no color" to enable theme-based default
function isNearBlackOrWhite(input: string, threshold: number = 16): boolean {
  const hex = normalizeHex(input);
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const { r, g, b } = rgb;
  const nearBlack = r <= threshold && g <= threshold && b <= threshold;
  const nearWhite = r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
  return nearBlack || nearWhite;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHex(hex);
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return { r, g, b };
}

// JSON node types used for TipTap doc JSON
type PMJSONMark = { type: string; attrs?: Record<string, unknown> };
type PMJSONNode = { type: string; text?: string; marks?: PMJSONMark[]; content?: PMJSONNode[] };

// Convert runs -> ProseMirror doc JSON
function richTextToPMDoc(richText: RichTextJSONPart[] | null): JSONContent {
  if (!richText || richText.length === 0) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }

  const paragraph: PMJSONNode = { type: 'paragraph', content: [] };

  for (const part of richText) {
    const segments = String(part.text ?? '').split('\n');
    segments.forEach((seg, idx) => {
      if (seg.length > 0) {
        paragraph.content!.push({
          type: 'text',
          text: seg,
          marks: buildMarks(part)
        });
      }
      if (idx < segments.length - 1) {
        paragraph.content!.push({ type: 'hardBreak' });
      }
    });
  }

  return { type: 'doc', content: [paragraph] } as JSONContent;
}

function buildMarks(part: RichTextJSONPart): PMJSONMark[] | undefined {
  const marks: PMJSONMark[] = [];
  if (part.bold) marks.push({ type: 'bold' });
  if (part.italic) marks.push({ type: 'italic' });
  if (part.underline) marks.push({ type: 'underline' });
  if (part.strikethrough) marks.push({ type: 'strike' });
  if (part.color) marks.push({ type: 'textStyle', attrs: { color: part.color } });
  return marks.length ? marks : undefined;
}

// Convert ProseMirror doc JSON -> runs
function pmDocToRichText(doc: JSONContent | null): RichTextJSONPart[] | null {
  if (!doc || !('content' in doc) || !doc.content) return null;
  const parts: RichTextJSONPart[] = [];

  const append = (text: string, fmt: Partial<RichTextJSONPart>) => {
    if (!text) return;
    const last = parts[parts.length - 1];
    const next: RichTextJSONPart = {
      text,
      bold: fmt.bold ?? null,
      italic: fmt.italic ?? null,
      underline: fmt.underline ?? null,
      strikethrough: fmt.strikethrough ?? null,
      color: fmt.color ?? null,
    };
    if (
      last &&
      last.bold === next.bold &&
      last.italic === next.italic &&
      last.underline === next.underline &&
      last.strikethrough === next.strikethrough &&
      last.color === next.color
    ) {
      last.text += next.text;
    } else {
      parts.push(next);
    }
  };

  const walk = (node: PMJSONNode | undefined, fmt: Partial<RichTextJSONPart>) => {
    if (!node) return;
    switch (node.type) {
      case 'doc': {
        const content = node.content || [];
        content.forEach((n, idx: number) => {
          walk(n, fmt);
          if (idx < content.length - 1) {
            // Single newline between block nodes (paragraphs)
            append('\n', {});
          }
        });
        break;
      }
      case 'paragraph':
        (node.content || []).forEach((n) => walk(n, fmt));
        break;
      case 'text': {
        const nextFmt: Partial<RichTextJSONPart> = { ...fmt };
        if (Array.isArray(node.marks)) {
          for (const m of node.marks) {
            switch (m.type) {
              case 'bold': nextFmt.bold = true; break;
              case 'italic': nextFmt.italic = true; break;
              case 'underline': nextFmt.underline = true; break;
              case 'strike': nextFmt.strikethrough = true; break;
              case 'textStyle': if (m.attrs && 'color' in m.attrs && typeof m.attrs.color === 'string') nextFmt.color = m.attrs.color; break;
            }
          }
        }
        append(String(node.text || ''), nextFmt);
        break;
      }
      case 'hardBreak':
        append('\n', fmt);
        break;
      default:
        break;
    }
  };

  // doc from TipTap may be partial; cast to PMJSONNode for traversal root with default type
  walk(doc as PMJSONNode, {});

  if (parts.length > 0) {
    parts[parts.length - 1].text = parts[parts.length - 1].text.replace(/\n+$/, '');
  }

  return parts.length ? parts : null;
}

