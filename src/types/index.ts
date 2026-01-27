export interface Template {
  id: string;
  name: string;
  content: string;
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
