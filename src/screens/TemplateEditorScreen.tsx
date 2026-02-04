import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateEditor, type TemplateEditorHandle } from '../components/TemplateEditor/TemplateEditor';
import { VariableInspector } from '../components/TemplateEditor/VariableInspector';
import { Button } from '../components/common/Button';
import { Sidebar } from '../components/common/Sidebar';
import { getTemplate, saveTemplate } from '../storage/localStorage';
import { Template } from '../types';
import type { VariableType } from '../types';
import { extractVariables } from '../utils/templateParser';
import { formatDistanceToNow } from 'date-fns';

export function TemplateEditorScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editorRef = useRef<TemplateEditorHandle>(null);
  const [template, setTemplate] = useState<Template>({
    id: id || crypto.randomUUID(),
    name: 'Untitled Template',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [variables, setVariables] = useState<string[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveBanner, setSaveBanner] = useState<'success' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const savedTemplate = getTemplate(id);
        if (savedTemplate) {
          setTemplate(savedTemplate);
          setVariables(extractVariables(savedTemplate.content));
        } else {
          setError('Template not found');
        }
      } catch (err) {
        console.error('Error loading template:', err);
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleContentChange = useCallback((content: string) => {
    setTemplate(prev => ({ ...prev, content }));
  }, []);

  const handleVariablesDetected = useCallback((detectedVariables: string[]) => {
    setVariables(detectedVariables);
  }, []);

  const handleVariableTypeChange = useCallback((variable: string, type: VariableType) => {
    setTemplate(prev => ({
      ...prev,
      variableDefinitions: {
        ...(prev.variableDefinitions || {}),
        [variable]: { type },
      },
    }));
  }, []);

  const handleAddVariable = useCallback((name: string, type: VariableType) => {
    const safeName = name.trim().replace(/\s+/g, '_');
    if (!safeName) return;
    setTemplate(prev => ({
      ...prev,
      variableDefinitions: {
        ...(prev.variableDefinitions || {}),
        [safeName]: { type },
      },
    }));
    setVariables(prev => (prev.includes(safeName) ? prev : [...prev, safeName].sort()));
    editorRef.current?.insertVariable(safeName);
  }, []);

  const handleSave = useCallback(async () => {
    if (!template.content.trim()) {
      setError('Please add some content to your template before saving.');
      return;
    }
    if (!template.name.trim() || template.name === 'Untitled Template') {
      setError('Please give your template a name (top title field) before saving.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedTemplate: Template = {
        ...template,
        updatedAt: new Date().toISOString(),
      };
      
      saveTemplate(updatedTemplate);
      setTemplate(updatedTemplate);
      setLastSaved(new Date());
      setSaveBanner('success');
      window.setTimeout(() => setSaveBanner(null), 2000);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [template]);

  const handleNext = () => {
    if (variables.length === 0) {
      setError('Please add at least one variable (e.g., {{company}}, {{position}}) to your template.');
      return;
    }
    if (!template.content.trim()) {
      setError('Please write some content in your template.');
      return;
    }
    
    setError(null);
    
    // Save template before proceeding if it's new or hasn't been saved
    if (!id || template.name === 'Untitled Template') {
      handleSave().then(() => {
        if (!error) {
          navigate(`/generate/${template.id}`);
        }
      });
    } else {
      navigate(`/generate/${template.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      {/* Main Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Template Editor</h1>
                      {lastSaved && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Draft saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    My Templates
                  </button>
                  <button
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Drafts
                  </button>
                  <Button 
                    variant="secondary" 
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                  >
                    {saving ? 'Saving...' : 'Save Template'}
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={saving}
                    size="sm"
                  >
                    Preview
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              {saveBanner === 'success' && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs text-green-800 dark:text-green-200">
                  Template saved
                </div>
              )}
              {error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Main Editor Area: central editor + right Variable Inspector (design: dark mode layout) */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Central editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 min-w-0 mx-10">
              {/* Breadcrumbs */}
              <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Templates / {template.name || 'Untitled Template'}
                </p>
              </div>

              {/* Template Title */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                  placeholder="Template Name"
                />
              </div>

              {/* Rich Text Editor */}
              <div className="flex-1 overflow-auto min-h-0">
                <TemplateEditor
                  ref={editorRef}
                  content={template.content}
                  existingVariables={variables}
                  onContentChange={handleContentChange}
                  onVariablesDetected={handleVariablesDetected}
                />
              </div>
            </div>

            {/* Variable Inspector sidebar (right) - matches attached design, both themes */}
            <div className="w-80 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
              <div className="p-4">
                <VariableInspector
                  variables={variables}
                  content={template.content}
                  variableDefinitions={template.variableDefinitions}
                  onVariableTypeChange={handleVariableTypeChange}
                  onAddVariable={handleAddVariable}
                />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
