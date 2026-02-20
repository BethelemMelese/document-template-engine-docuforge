import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/common/AppLayout';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Dialog } from '../components/common/Dialog';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  return (
    <AppLayout
      title="Dashboard / Settings"
      actions={
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Dashboard
        </Button>
      }
    >
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
