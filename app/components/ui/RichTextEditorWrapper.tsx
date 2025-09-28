'use client';

import dynamic from 'next/dynamic';
import { RichTextJSONPart } from '../../types';

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor').then(mod => ({ default: mod.RichTextEditor })), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] flex items-center justify-center text-gray-500 dark:text-gray-400">
      Loading editor...
    </div>
  )
});

interface RichTextEditorWrapperProps {
  value: RichTextJSONPart[] | null;
  onChange: (richText: RichTextJSONPart[] | null) => void;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function RichTextEditorWrapper(props: RichTextEditorWrapperProps) {
  return <RichTextEditor {...props} />;
}
