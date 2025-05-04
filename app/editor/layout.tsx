import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relationship Menu - Editor',
  description: 'Create, edit, and customize your personal relationship menu.',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 