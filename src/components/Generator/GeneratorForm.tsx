import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { format } from 'date-fns';
import type { VariableType } from '../../types';

interface VariableDefinitions {
  [variableName: string]: { type: VariableType };
}

interface GeneratorFormProps {
  variables: string[];
  variableDefinitions?: VariableDefinitions | null;
  onGenerate: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

export function GeneratorForm({ variables, variableDefinitions, onGenerate, initialValues = {} }: GeneratorFormProps) {
  const getType = (variable: string): VariableType =>
    variableDefinitions?.[variable]?.type ?? 'text';

  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    variables.forEach(variable => {
      const type = getType(variable);
      if (type === 'date') {
        defaults[variable] = format(new Date(), 'MMMM d, yyyy');
      } else {
        defaults[variable] = initialValues[variable] || '';
      }
    });
    return defaults;
  });

  const dateInputValues = useMemo(() => {
    const map: Record<string, string> = {};
    variables.forEach(variable => {
      if (getType(variable) !== 'date') return;
      const val = formValues[variable];
      if (val) {
        try {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            map[variable] = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          } else {
            const today = new Date();
            map[variable] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          }
        } catch {
          const today = new Date();
          map[variable] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
      } else {
        const today = new Date();
        map[variable] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      }
    });
    return map;
  }, [variables, formValues, variableDefinitions]);

  const handleChange = (variable: string, value: string) => {
    setFormValues(prev => ({ ...prev, [variable]: value }));
  };

  const handleDateChange = (variable: string, isoDate: string) => {
    const displayValue = isoDate ? format(new Date(isoDate), 'MMMM d, yyyy') : '';
    handleChange(variable, displayValue);
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
    return labels[variable] || variable.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary';

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Fill Application Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {variables.map((variable) => {
          const type = getType(variable);
          return (
            <div key={variable}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {getLabel(variable)}
              </label>
              {type === 'date' ? (
                <input
                  type="date"
                  value={dateInputValues[variable] ?? ''}
                  onChange={(e) => handleDateChange(variable, e.target.value)}
                  className={inputClass}
                  required
                />
              ) : type === 'number' ? (
                <input
                  type="number"
                  value={formValues[variable] ?? ''}
                  onChange={(e) => handleChange(variable, e.target.value)}
                  className={inputClass}
                  placeholder="0"
                  required
                />
              ) : (
                <input
                  type={variable.toLowerCase().includes('email') ? 'email' : 'text'}
                  value={formValues[variable] || ''}
                  onChange={(e) => handleChange(variable, e.target.value)}
                  className={inputClass}
                  placeholder={variable.toLowerCase().includes('email') ? 'hr@company.com (optional)' : undefined}
                  required={!variable.toLowerCase().includes('email')}
                />
              )}
            </div>
          );
        })}
        <Button type="submit" size="lg" className="w-full mt-6">
          Generate Letter
        </Button>
      </form>
    </Card>
  );
}
