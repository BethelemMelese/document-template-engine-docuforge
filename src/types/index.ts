export type TemplateCategory = 'TECH' | 'MARKETING' | 'BUSINESS' | 'DESIGN' | 'OTHER';

/** Variable type for generator form: text input, date picker, or number input */
export type VariableType = 'text' | 'date' | 'number';

export interface Template {
  id: string;
  name: string;
  content: string;
  category?: TemplateCategory;
  icon?: string; // Icon identifier for the template
  views?: number; // View count
  /** Optional: type per variable name for generator (text, date, number). Omitted = text */
  variableDefinitions?: Record<string, { type: VariableType }>;
  createdAt: string;
  updatedAt: string;
}

export interface Variable {
  name: string;
  value: string;
}

export interface Application {
  id: string;
  templateId: string;
  company: string;
  position: string;
  date: string;
  email?: string;
  mergedContent: string;
  createdAt: string;
}
