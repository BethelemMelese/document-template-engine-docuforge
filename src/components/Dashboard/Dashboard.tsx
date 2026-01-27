import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../types';
import { getTemplates, deleteTemplate, saveTemplate } from '../../storage/localStorage';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { format } from 'date-fns';
import { extractVariables } from '../../utils/templateParser';

export function Dashboard() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setLoading(true);
    try {
      const savedTemplates = getTemplates();
      setTemplates(savedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        deleteTemplate(id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete template. Please try again.');
      }
    }
  };

  const handleDuplicate = (template: Template) => {
    try {
      const newTemplate: Template = {
        ...template,
        id: crypto.randomUUID(),
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveTemplate(newTemplate);
      loadTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('Failed to duplicate template. Please try again.');
    }
  };

  const handleGenerate = (templateId: string) => {
    navigate(`/generate/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">LetterForge</h1>
            <Button onClick={() => navigate('/editor')}>
              + New Template
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Loading templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <Card className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Create your first cover letter template
              </h2>
              <p className="text-gray-600 mb-8">
                Get started by creating a reusable template with dynamic variables like {'{{company}}'}, {'{{position}}'}, and {'{{date}}'}.
              </p>
              <Button size="lg" onClick={() => navigate('/editor')}>
                + Create Template
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Templates</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {templates.length} {templates.length === 1 ? 'template' : 'templates'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const variables = extractVariables(template.content);
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Last edited: {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                        </p>
                        {variables.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Variables:</p>
                            <div className="flex flex-wrap gap-1">
                              {variables.slice(0, 3).map((variable) => (
                                <span
                                  key={variable}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {'{{' + variable + '}}'}
                                </span>
                              ))}
                              {variables.length > 3 && (
                                <span className="text-xs text-gray-500">+{variables.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => handleGenerate(template.id)}
                        >
                          Generate Letter
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/editor/${template.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(template)}
                            title="Duplicate template"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id, template.name)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete template"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
