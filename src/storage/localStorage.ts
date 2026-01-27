import { Template, Application } from '../types';

const TEMPLATES_KEY = 'letterforge_templates';
const APPLICATIONS_KEY = 'letterforge_applications';

export function saveTemplate(template: Template): void {
  const templates = getTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() };
  } else {
    templates.push(template);
  }
  
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export function getTemplates(): Template[] {
  const data = localStorage.getItem(TEMPLATES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTemplate(id: string): Template | undefined {
  const templates = getTemplates();
  return templates.find(t => t.id === id);
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates();
  const filtered = templates.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
}

export function saveApplication(application: Application): void {
  const applications = getApplications();
  applications.push(application);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

export function getApplications(): Application[] {
  const data = localStorage.getItem(APPLICATIONS_KEY);
  return data ? JSON.parse(data) : [];
}
