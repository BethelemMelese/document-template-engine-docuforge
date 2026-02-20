import { apiRequest } from './client';
import type { Template, Application } from '../types';
import type { VariableType } from '../types';

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  register: (email: string, password: string, name?: string) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiRequest<User>('/auth/me'),
};

export const templatesApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    const query = q.toString();
    return apiRequest<Template[]>(`/templates${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiRequest<Template>(`/templates/${id}`),
  create: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiRequest<Template>('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Pick<Template, 'name' | 'content' | 'category' | 'icon' | 'variableDefinitions'>>) =>
    apiRequest<Template>(`/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/templates/${id}`, { method: 'DELETE' }),
  incrementViews: (id: string) =>
    apiRequest<{ views: number }>(`/templates/${id}/increment-views`, {
      method: 'PUT',
    }),
};

export const applicationsApi = {
  getAll: () => apiRequest<Application[]>('/applications'),
  create: (data: Omit<Application, 'id' | 'createdAt'>) =>
    apiRequest<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export interface GlobalVariableDto {
  name: string;
  type: VariableType;
}

export const globalVariablesApi = {
  getAll: () => apiRequest<GlobalVariableDto[]>('/global-variables'),
  setAll: (vars: GlobalVariableDto[]) =>
    apiRequest<GlobalVariableDto[]>('/global-variables', {
      method: 'PUT',
      body: JSON.stringify(vars),
    }),
  add: (name: string, type: VariableType) =>
    apiRequest<GlobalVariableDto>('/global-variables', {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    }),
  delete: (name: string) =>
    apiRequest<void>(`/global-variables/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),
};
