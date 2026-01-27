import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TemplateEditor } from '../components/TemplateEditor/TemplateEditor';
import { VariablePanel } from '../components/TemplateEditor/VariablePanel';
import { Button } from '../components/common/Button';
import { getTemplate, saveTemplate } from '../storage/localStorage';
import { Template } from '../types';
import { extractVariables } from '../utils/templateParser';

export function TemplateEditorScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
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
  const [saved, setSaved] = useState(false);
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
    setSaved(false);
  }, []);

  const handleVariablesDetected = useCallback((detectedVariables: string[]) => {
    setVariables(detectedVariables);
  }, []);

  const handleSave = useCallback(async () => {
    if (!template.content.trim()) {
      setError('Please add some content to your template before saving.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let templateName = template.name;
      
      if (template.name === 'Untitled Template' || !template.name.trim()) {
        const nameInput = window.prompt('Enter template name:', template.name);
        if (!nameInput || !nameInput.trim()) {
          setSaving(false);
          return;
        }
        templateName = nameInput.trim();
      }

      const updatedTemplate: Template = {
        ...template,
        name: templateName,
        updatedAt: new Date().toISOString(),
      };
      
      saveTemplate(updatedTemplate);
      setTemplate(updatedTemplate);
      setSaved(true);
      
      setTimeout(() => setSaved(false), 3000);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">LetterForge</h1>
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Saved
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => navigate('/')}>
                ← Dashboard
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Template'}
              </Button>
              <Button onClick={handleNext} disabled={saving}>
                Next → Generate
              </Button>
            </div>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="text-2xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
            placeholder="Template Name"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Rich Text Editor */}
          <div className="lg:col-span-2">
            <TemplateEditor
              content={template.content}
              onContentChange={handleContentChange}
              onVariablesDetected={handleVariablesDetected}
              onSave={handleSave}
            />
          </div>

          {/* Right: Variable Panel */}
          <div className="lg:col-span-1">
            <VariablePanel variables={variables} />
          </div>
        </div>
      </div>
    </div>
  );
}
