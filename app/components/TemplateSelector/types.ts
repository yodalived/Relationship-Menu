export type TemplateIcon = {
  type: string;
  path: string;
};

export type TemplateItem = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon?: TemplateIcon;
  stats?: {
    sections: number;
    items: number;
  };
};

export type TemplateData = {
  menu: Array<{
    name: string;
    items: Array<{
      name: string;
      note?: string | null;
      icon?: string | null;
    }>;
  }>;
};

export type PeopleFormProps = {
  selectedTemplate: TemplateItem;
  onSubmit: (templatePath: string, people: string[]) => void;
  onCancel: () => void;
};

export interface TemplateSelectorProps {
  onTemplateSelected: (templatePath: string, people: string[]) => void;
} 