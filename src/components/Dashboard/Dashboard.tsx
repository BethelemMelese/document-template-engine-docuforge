import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, TemplateCategory } from '../../types';
import { getTemplates, createTemplate, deleteTemplate } from '../../storage/apiStorage';
import { Button } from '../common/Button';
import { AppLayout } from '../common/AppLayout';
import { Dialog } from '../common/Dialog';
import { extractVariables } from '../../utils/templateParser';
import { getCategoryIcon, getCategoryTagColor, formatRelativeTime, formatViewCount } from '../../utils/templateUtils';

const CATEGORIES: { value: TemplateCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'TECH', label: 'Tech' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'OTHER', label: 'Other' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const savedTemplates = await getTemplates();
      setTemplates(savedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = useMemo(() => {
    let list = templates;
    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter);
    }
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.category?.toLowerCase().includes(query)
    );
  }, [templates, searchQuery, categoryFilter]);

  const totalVariables = useMemo(() => {
    return templates.reduce((acc, template) => {
      return acc + extractVariables(template.content).length;
    }, 0);
  }, [templates]);

  const handleDuplicate = async (template: Template) => {
    try {
      await createTemplate({
        name: `${template.name} (Copy)`,
        content: template.content,
        category: template.category,
        icon: template.icon,
        views: 0,
        variableDefinitions: template.variableDefinitions,
      });
      await loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleGenerate = (templateId: string) => {
    navigate(`/generate/${templateId}`);
  };

  const handleEdit = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    navigate(`/editor/${templateId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    setTemplateToDelete(template);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplate(templateToDelete.id);
      setTemplateToDelete(null);
      await loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent, template: Template) => {
    e.stopPropagation();
    handleDuplicate(template);
  };

  return (
    <AppLayout
      title="Dashboard / Templates"
      actions={
        <Button onClick={() => navigate('/editor')} size="sm">
          <svg className="w-4 h-4 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Template
        </Button>
      }
    >
      <div className="p-4 sm:p-6 lg:p-8">
          {/* Title and Search */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Templates</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your dynamic cover letters and variables.</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
              <div className="relative max-w-md w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ value, label }) => (
                  <button
                    key={value || 'all'}
                    type="button"
                    onClick={() => setCategoryFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === value
                        ? 'bg-primary text-white dark:bg-primary-600'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loadError && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm flex items-center justify-between">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={loadTemplates}
                className="underline font-medium hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
              </div>
            </div>
          ) : filteredTemplates.length === 0 && templates.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Create your first cover letter template
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Get started by creating a reusable template with dynamic variables.
                </p>
                <Button size="lg" onClick={() => navigate('/editor')}>
                  + Create Template
                </Button>
              </div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">No templates found matching your search.</p>
            </div>
          ) : (
            <>
              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredTemplates.map((template) => {
                  const variables = extractVariables(template.content);
                  
                  return (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleGenerate(template.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        {getCategoryIcon(template.category, template.icon)}
                        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => handleEdit(e, template.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            title="Edit template"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDuplicateClick(e, template)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            title="Duplicate template"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClick(e, template)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete template"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {template.category && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryTagColor(template.category)}`}>
                            {template.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Last edited {formatRelativeTime(template.updatedAt)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{variables.length} variables</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{formatViewCount(template.views)} views</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Template Card */}
                <div
                  className="bg-white dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer min-h-[200px]"
                  onClick={() => navigate('/editor')}
                >
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-600 font-medium">Add Template</p>
                </div>
              </div>

              {/* Manage Shared Variables Section */}
              {totalVariables > 0 && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Manage Shared Variables</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You have {totalVariables} active variables across all your templates.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/variables')}>
                    Edit Global Variables
                  </Button>
                </div>
              )}

              <Dialog
                open={!!templateToDelete}
                title="Delete template?"
                description={templateToDelete ? `"${templateToDelete.name}" will be permanently deleted. This cannot be undone.` : ''}
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onClose={() => setTemplateToDelete(null)}
                size="sm"
              />
            </>
          )}
      </div>
    </AppLayout>
  );
}
