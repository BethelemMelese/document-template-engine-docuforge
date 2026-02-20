import type { Template, Application } from '../types';

const BACKUP_VERSION = 1;

export interface TemplatesBackup {
  version: number;
  exportedAt: string;
  templates: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>[];
}

export interface ApplicationsBackup {
  version: number;
  exportedAt: string;
  applications: Omit<Application, 'id' | 'createdAt'>[];
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function createTemplatesBackup(templates: Template[]): string {
  const backup: TemplatesBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    templates: templates.map(({ id, createdAt, updatedAt, ...rest }) => rest),
  };
  return JSON.stringify(backup, null, 2);
}

export function createApplicationsBackup(applications: Application[]): string {
  const backup: ApplicationsBackup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    applications: applications.map(({ id, createdAt, ...rest }) => rest),
  };
  return JSON.stringify(backup, null, 2);
}

export function parseTemplatesBackup(json: string): Omit<Template, 'id' | 'createdAt' | 'updatedAt'>[] {
  const data = JSON.parse(json) as TemplatesBackup;
  if (!data.templates || !Array.isArray(data.templates)) {
    throw new Error('Invalid backup format: missing templates array');
  }
  return data.templates.map((t) => ({
    name: t.name ?? 'Imported Template',
    content: t.content ?? '',
    category: t.category,
    icon: t.icon,
    views: 0,
    variableDefinitions: t.variableDefinitions,
  }));
}

export function parseApplicationsBackup(json: string): Omit<Application, 'id' | 'createdAt'>[] {
  const data = JSON.parse(json) as ApplicationsBackup;
  if (!data.applications || !Array.isArray(data.applications)) {
    throw new Error('Invalid backup format: missing applications array');
  }
  return data.applications;
}
