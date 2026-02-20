import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/common/AppLayout';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Dialog } from '../components/common/Dialog';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getTemplates, getApplications, createTemplate } from '../storage/apiStorage';
import {
  createTemplatesBackup,
  createApplicationsBackup,
  parseTemplatesBackup,
  downloadJson,
} from '../utils/backup';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [backupStatus, setBackupStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <AppLayout
      title="Dashboard / Settings"
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Dashboard
        </Button>
      }
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Data & Backup</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Export your templates and applications as JSON. Import templates from a previous backup.
              </p>
              {backupStatus && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    backupStatus.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  }`}
                >
                  {backupStatus.message}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const templates = await getTemplates();
                      const json = createTemplatesBackup(templates);
                      downloadJson(json, `letterforge-templates-${new Date().toISOString().slice(0, 10)}.json`);
                      setBackupStatus({ type: 'success', message: `Exported ${templates.length} templates.` });
                      setTimeout(() => setBackupStatus(null), 3000);
                    } catch (e) {
                      setBackupStatus({ type: 'error', message: e instanceof Error ? e.message : 'Export failed.' });
                    }
                  }}
                >
                  Export Templates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const applications = await getApplications();
                      const json = createApplicationsBackup(applications);
                      downloadJson(json, `letterforge-applications-${new Date().toISOString().slice(0, 10)}.json`);
                      setBackupStatus({ type: 'success', message: `Exported ${applications.length} applications.` });
                      setTimeout(() => setBackupStatus(null), 3000);
                    } catch (e) {
                      setBackupStatus({ type: 'error', message: e instanceof Error ? e.message : 'Export failed.' });
                    }
                  }}
                >
                  Export Applications
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={importing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {importing ? 'Importing...' : 'Import Templates'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImporting(true);
                    setBackupStatus(null);
                    try {
                      const text = await file.text();
                      const templates = parseTemplatesBackup(text);
                      let created = 0;
                      for (const t of templates) {
                        await createTemplate(t);
                        created++;
                      }
                      setBackupStatus({ type: 'success', message: `Imported ${created} templates.` });
                      setTimeout(() => setBackupStatus(null), 3000);
                    } catch (err) {
                      setBackupStatus({
                        type: 'error',
                        message: err instanceof Error ? err.message : 'Invalid backup file.',
                      });
                    } finally {
                      setImporting(false);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Your templates and applications are stored in your account. Sign out to use another device or account.
              </p>
              <Button variant="outline" size="sm" onClick={() => setClearConfirmOpen(true)}>
                Sign out
              </Button>
              <Dialog
                open={clearConfirmOpen}
                title="Sign out?"
                description="You will need to sign in again to access your templates. Your data remains saved in your account."
                confirmText="Sign out"
                onConfirm={() => {
                  logout();
                  setClearConfirmOpen(false);
                  navigate('/login');
                }}
                onClose={() => setClearConfirmOpen(false)}
              />
            </section>
          </div>
      </div>
    </AppLayout>
  );
}
