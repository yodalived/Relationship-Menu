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
  title?: string;
  subtitle?: string;
  className?: string;
  isModal?: boolean;
  onClose?: () => void;
} 