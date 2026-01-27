import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GeneratorForm } from '../components/Generator/GeneratorForm';
import { LivePreview } from '../components/Generator/LivePreview';
import { ExportButtons } from '../components/Generator/ExportButtons';
import { Sidebar } from '../components/common/Sidebar';
import { getTemplate } from '../storage/localStorage';
import { extractVariables, mergeTemplate } from '../utils/templateParser';
import { Button } from '../components/common/Button';
import { Template } from '../types';

export function GeneratorScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [template, setTemplate] = useState<string>('');
  const [variables, setVariables] = useState<string[]>([]);
  const [mergedContent, setMergedContent] = useState<string>('');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      try {
        const savedTemplate = getTemplate(id);
        if (savedTemplate) {
          setTemplateData(savedTemplate);
          setTemplate(savedTemplate.content);
          const detectedVars = extractVariables(savedTemplate.content);
          setVariables(detectedVars);
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
      setError('No template ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleGenerate = (values: Record<string, string>) => {
    setFormValues(values);
    const merged = mergeTemplate(template, values);
    setMergedContent(merged);
    setShowPreview(true);
    // Scroll to preview
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditVariables = () => {
    setShowPreview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-2">Template Not Found</p>
          <p className="text-gray-600 mb-6">{error || 'The template you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500">
                Dashboard / Templates / Generate
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(`/editor/${id}`)} size="sm">
                  Edit Template
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} size="sm">
                  ← Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {!showPreview ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generate Cover Letter</h2>
                <p className="text-gray-600">
                  Fill in the details below to generate your personalized cover letter.
                </p>
              </div>
              <GeneratorForm
                variables={variables}
                onGenerate={handleGenerate}
              />
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Preview & Export</h2>
                  <p className="text-sm text-gray-500 mt-1">Review your cover letter and choose an action</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Preview */}
                <div className="lg:col-span-2">
                  <LivePreview content={mergedContent} />
                </div>

                {/* Right: Export Actions */}
                <div className="lg:col-span-1 space-y-4">
                  <ExportButtons
                    content={mergedContent}
                    company={formValues.company || ''}
                    position={formValues.position || ''}
                    onEdit={handleEditVariables}
                  />
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      onClick={() => navigate(`/email/${id}`, { 
                        state: { 
                          content: mergedContent, 
                          company: formValues.company || '',
                          position: formValues.position || '',
                          email: formValues.email || ''
                        } 
                      })}
                    >
                      Continue to Email →
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
