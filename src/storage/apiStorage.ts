import { templatesApi, applicationsApi, globalVariablesApi } from '../api/endpoints';
import type { Template, Application } from '../types';
import type { VariableType } from '../types';

export interface GlobalVariable {
  name: string;
  type: VariableType;
}

export async function getTemplates(params?: { category?: string; search?: string }): Promise<Template[]> {
  return templatesApi.getAll(params);
}

export async function getTemplate(id: string): Promise<Template | null> {
  try {
    return await templatesApi.getById(id);
  } catch {
    return null;
  }
}

export async function createTemplate(
  data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Template> {
  return templatesApi.create(data);
}

export async function updateTemplate(
  id: string,
  data: Partial<Pick<Template, 'name' | 'content' | 'category' | 'icon' | 'variableDefinitions'>>
): Promise<Template> {
  return templatesApi.update(id, data);
}

export async function deleteTemplate(id: string): Promise<void> {
  await templatesApi.delete(id);
}

export async function incrementTemplateViews(id: string): Promise<number> {
  const res = await templatesApi.incrementViews(id);
  return res.views;
}

export async function getApplications(): Promise<Application[]> {
  return applicationsApi.getAll();
}

export async function saveApplication(application: Omit<Application, 'id' | 'createdAt'>): Promise<Application> {
  return applicationsApi.create(application);
}

export async function getGlobalVariables(): Promise<GlobalVariable[]> {
  return globalVariablesApi.getAll();
}

export async function saveGlobalVariables(variables: GlobalVariable[]): Promise<GlobalVariable[]> {
  return globalVariablesApi.setAll(variables);
}
