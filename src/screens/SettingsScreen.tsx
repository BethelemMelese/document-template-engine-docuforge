import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Dialog } from '../components/common/Dialog';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Dashboard / Settings
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your LetterForge preferences.
            </p>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Appearance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose light or dark theme.</p>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  Current: {theme ?? 'system'}
                </span>
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Templates and applications are stored locally in your browser. Clearing data will remove all templates and history.
              </p>
              <Button variant="outline" size="sm" onClick={() => setClearConfirmOpen(true)}>
                Clear local data
              </Button>
              <Dialog
                open={clearConfirmOpen}
                title="Clear local data?"
                description="This will remove all templates and application history. This cannot be undone."
                confirmText="Clear all"
                onConfirm={() => {
                  localStorage.removeItem('letterforge_templates');
                  localStorage.removeItem('letterforge_applications');
                  localStorage.removeItem('letterforge_global_variables');
                  setClearConfirmOpen(false);
                  window.location.href = '/';
                }}
                onClose={() => setClearConfirmOpen(false)}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
