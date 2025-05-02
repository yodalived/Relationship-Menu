import { MenuData } from '../../types';

export type TemplateIcon = {
  type: string;
  path: string;
};

export type TemplateItem = {
  id: string;
  name: string;
  description: string;
  path: string;
  icon?: TemplateIcon;
  stats?: {
    sections: number;
    items: number;
  };
};

export type PeopleFormProps = {
  selectedTemplate: TemplateItem;
  onSubmit: (templatePath: string, people: string[]) => void;
  onCancel: () => void;
};

export interface TemplateSelectorProps {
  onTemplateSelected: (menuData: MenuData, initialMode: 'view' | 'fill' | 'edit') => void;
  title?: string;
  subtitle?: string;
  className?: string;
} 