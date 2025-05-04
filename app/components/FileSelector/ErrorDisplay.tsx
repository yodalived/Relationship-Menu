import { IconWarning } from '../icons';

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-start">
      <IconWarning className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );
} 