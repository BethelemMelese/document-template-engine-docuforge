import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Button } from '../components/common/Button';
import { getApplications } from '../storage/localStorage';
import { getTemplate } from '../storage/localStorage';
import { formatDistanceToNow } from 'date-fns';

export function HistoryScreen() {
  const navigate = useNavigate();
  const applications = getApplications();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Dashboard / History
              </div>
              <Button variant="outline" onClick={() => navigate('/')} size="sm">
                Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Application History</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Past cover letter applications you’ve generated.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No applications yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Generate a cover letter from a template to see it here.</p>
              <Button className="mt-4" onClick={() => navigate('/')}>
                Go to Templates
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...applications].reverse().map((app) => {
                const template = getTemplate(app.templateId);
                return (
                  <div
                    key={app.id}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{app.company || 'Unknown company'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{app.position || '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {template?.name ?? 'Template'} · {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/generate/${app.templateId}`, { state: { fromHistory: true } })}
                      >
                        Use template again
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                        View templates
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
