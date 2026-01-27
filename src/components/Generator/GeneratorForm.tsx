import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { format } from 'date-fns';

interface GeneratorFormProps {
  variables: string[];
  onGenerate: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

export function GeneratorForm({ variables, onGenerate, initialValues = {} }: GeneratorFormProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    variables.forEach(variable => {
      if (variable === 'date') {
        defaults[variable] = format(new Date(), 'MMMM d, yyyy');
      } else {
        defaults[variable] = initialValues[variable] || '';
      }
    });
    return defaults;
  });

  const [dateInputValue, setDateInputValue] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  const handleChange = (variable: string, value: string) => {
    setFormValues(prev => ({ ...prev, [variable]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formValues);
  };

  const getLabel = (variable: string): string => {
    const labels: Record<string, string> = {
      company: 'Company Name',
      position: 'Position',
      date: 'Application Date',
      email: 'Hiring Manager Email',
    };
    return labels[variable] || variable.charAt(0).toUpperCase() + variable.slice(1);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Fill Application Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {variables.map((variable) => (
          <div key={variable}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getLabel(variable)}
            </label>
            {variable === 'date' ? (
              <input
                type="date"
                value={dateInputValue}
                onChange={(e) => {
                  setDateInputValue(e.target.value);
                  const dateValue = e.target.value ? format(new Date(e.target.value), 'MMMM d, yyyy') : '';
                  handleChange(variable, dateValue);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ) : variable === 'email' ? (
              <input
                type="email"
                value={formValues[variable] || ''}
                onChange={(e) => handleChange(variable, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="hr@company.com (optional)"
              />
            ) : (
              <input
                type="text"
                value={formValues[variable] || ''}
                onChange={(e) => handleChange(variable, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            )}
          </div>
        ))}
        <Button type="submit" size="lg" className="w-full mt-6">
          Generate Letter
        </Button>
      </form>
    </Card>
  );
}
