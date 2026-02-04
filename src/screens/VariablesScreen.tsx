import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Button } from '../components/common/Button';
import { getTemplates } from '../storage/localStorage';
import { getGlobalVariables, saveGlobalVariables, type GlobalVariable } from '../storage/localStorage';
import { extractVariables } from '../utils/templateParser';
import type { VariableType } from '../types';
import { Dialog } from '../components/common/Dialog';

const VARIABLE_TYPES: { value: VariableType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
];

export function VariablesScreen() {
  const navigate = useNavigate();
  const [globalVars, setGlobalVars] = useState<GlobalVariable[]>(() => getGlobalVariables());
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<VariableType>('text');

  const templates = getTemplates();
  const variablesFromTemplates = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => extractVariables(t.content).forEach((v) => set.add(v)));
    return Array.from(set).sort();
  }, [templates]);

  const handleAddGlobal = () => {
    const name = newName.trim().replace(/\s+/g, '_');
    if (!name || globalVars.some((v) => v.name === name)) return;
    const next = [...globalVars, { name, type: newType }];
    setGlobalVars(next);
    saveGlobalVariables(next);
    setAddOpen(false);
    setNewName('');
    setNewType('text');
  };

  const handleRemoveGlobal = (name: string) => {
    const next = globalVars.filter((v) => v.name !== name);
    setGlobalVars(next);
    saveGlobalVariables(next);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Dashboard / Variables
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  + Add global variable
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Edit Global Variables</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage variable names and types used across your templates. Global variables can be reused when inserting variables in the template editor.
            </p>
          </div>

          <div className="grid gap-6 max-w-3xl">
            <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Saved global variables</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Variables you’ve defined for reuse (name + type).</p>
              {globalVars.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-500">None yet. Add one above.</p>
              ) : (
                <ul className="space-y-2">
                  {globalVars.map((v) => (
                    <li
                      key={v.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{'{{' + v.name + '}}'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{v.type}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGlobal(v.name)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Variables in your templates</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">All variable names found in template content (read-only).</p>
              {variablesFromTemplates.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-500">No variables in templates yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {variablesFromTemplates.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary font-mono text-sm"
                    >
                      {'{{' + name + '}}'}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <Dialog
        open={addOpen}
        title="Add global variable"
        description="Define a variable name and type. You can insert it in any template from the editor."
        confirmText="Add"
        onConfirm={handleAddGlobal}
        onClose={() => { setAddOpen(false); setNewName(''); setNewType('text'); }}
        confirmDisabled={!newName.trim()}
        size="sm"
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Variable name</label>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. company_name"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-4"
        />
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Type</label>
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as VariableType)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {VARIABLE_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Dialog>
    </div>
  );
}
