export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
};

export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] ?? code;
}


