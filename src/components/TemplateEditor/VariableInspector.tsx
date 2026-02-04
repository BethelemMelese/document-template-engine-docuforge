import { useState, useMemo } from 'react';
import { countVariableUsage } from '../../utils/templateParser';
import type { VariableType } from '../../types';
import { Dialog } from '../common/Dialog';

interface VariableInfo {
  name: string;
  usage: number;
  required: boolean;
}

interface VariableInspectorProps {
  variables: string[];
  content: string;
  variableDefinitions?: Record<string, { type: VariableType }> | null;
  onVariableRequiredChange?: (variable: string, required: boolean) => void;
  onVariableTypeChange?: (variable: string, type: VariableType) => void;
  onAddVariable?: (name: string, type: VariableType) => void;
}

const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
];

export function VariableInspector({ 
  variables, 
  content,
  variableDefinitions,
  onVariableRequiredChange,
  onVariableTypeChange,
  onAddVariable,
}: VariableInspectorProps) {
  const [requiredVars, setRequiredVars] = useState<Set<string>>(new Set());
  const [defineVarOpen, setDefineVarOpen] = useState(false);
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<VariableType>('text');

  const variableInfo = useMemo(() => {
    return variables.map(variable => ({
      name: variable,
      usage: countVariableUsage(content, variable),
      required: requiredVars.has(variable),
    }));
  }, [variables, content, requiredVars]);

  const handleToggleRequired = (variable: string) => {
    const newRequired = new Set(requiredVars);
    if (newRequired.has(variable)) {
      newRequired.delete(variable);
    } else {
      newRequired.add(variable);
    }
    setRequiredVars(newRequired);
    onVariableRequiredChange?.(variable, newRequired.has(variable));
  };

  const getVariableColor = (index: number) => {
    const light = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-teal-50 border-teal-200'];
    const dark = ['dark:bg-blue-900/30 dark:border-blue-700', 'dark:bg-purple-900/30 dark:border-purple-700', 'dark:bg-teal-900/30 dark:border-teal-700'];
    return `${light[index % light.length]} ${dark[index % dark.length]}`;
  };

  const getVariableTextColor = (index: number) => {
    const light = ['text-blue-700', 'text-purple-700', 'text-teal-700'];
    const dark = ['dark:text-blue-300', 'dark:text-purple-300', 'dark:text-teal-300'];
    return `${light[index % light.length]} ${dark[index % dark.length]}`;
  };

  if (variables.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">Variable Inspector</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Variables will appear here when you use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-xs">{'{{variableName}}'}</code> in your template.
        </p>
        {onAddVariable && (
          <button
            type="button"
            onClick={() => { setDefineVarOpen(true); setNewVarName(''); setNewVarType('text'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors border border-dashed border-gray-300 dark:border-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Define New Global Variable
          </button>
        )}
        <Dialog
          open={defineVarOpen}
          title="Define New Global Variable"
          description="Add a variable name and type. It will be inserted into the template."
          confirmText="Add & Insert"
          onConfirm={() => {
            const name = newVarName.trim().replace(/\s+/g, '_');
            if (name) {
              onAddVariable?.(name, newVarType);
              setDefineVarOpen(false);
              setNewVarName('');
            }
          }}
          onClose={() => { setDefineVarOpen(false); setNewVarName(''); }}
          confirmDisabled={!newVarName.trim()}
          size="sm"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Variable name</label>
          <input
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            placeholder="e.g. company_name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Type</label>
          <select
            value={newVarType}
            onChange={(e) => setNewVarType(e.target.value as VariableType)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {VARIABLE_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {newVarName.trim() && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Will add <span className="font-mono">{'{{' + newVarName.trim().replace(/\s+/g, '_') + '}}'}</span> as {newVarType}
            </p>
          )}
        </Dialog>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">Variable Inspector</h3>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{variables.length} TOTAL</span>
      </div>

      <div className="space-y-3">
        {variableInfo.map((info, index) => (
          <div
            key={info.name}
            className={`p-3 rounded-lg border ${getVariableColor(index)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-mono font-semibold ${getVariableTextColor(index)}`}>
                    {'{{' + info.name + '}}'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{info.usage} {info.usage === 1 ? 'USE' : 'USES'}</span>
                </div>
              </div>
            </div>

            {(onVariableTypeChange || variableDefinitions) && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-600 dark:text-gray-400">Type</span>
                <select
                  value={variableDefinitions?.[info.name]?.type ?? 'text'}
                  onChange={(e) => onVariableTypeChange?.(info.name, e.target.value as VariableType)}
                  className="flex-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1"
                >
                  {VARIABLE_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-600 dark:text-gray-400">Mark as Required</span>
              <button
                onClick={() => handleToggleRequired(info.name)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  info.required ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-200 transition-transform ${
                    info.required ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => { setDefineVarOpen(true); setNewVarName(''); setNewVarType('text'); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Define New Global Variable
        </button>
      </div>

      <Dialog
        open={defineVarOpen}
        title="Define New Global Variable"
        description="Add a variable name and type. It will be inserted into the template."
        confirmText="Add & Insert"
        onConfirm={() => {
          const name = newVarName.trim().replace(/\s+/g, '_');
          if (name) {
            onAddVariable?.(name, newVarType);
            setDefineVarOpen(false);
            setNewVarName('');
          }
        }}
        onClose={() => { setDefineVarOpen(false); setNewVarName(''); }}
        confirmDisabled={!newVarName.trim()}
        size="sm"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Variable name</label>
        <input
          value={newVarName}
          onChange={(e) => setNewVarName(e.target.value)}
          placeholder="e.g. company_name"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Type</label>
        <select
          value={newVarType}
          onChange={(e) => setNewVarType(e.target.value as VariableType)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {VARIABLE_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {newVarName.trim() && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Will add <span className="font-mono">{'{{' + newVarName.trim().replace(/\s+/g, '_') + '}}'}</span> as {newVarType}
          </p>
        )}
      </Dialog>
    </div>
  );
}
