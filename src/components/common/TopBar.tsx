import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  /** Breadcrumb or custom header content (left side) */
  title?: React.ReactNode;
  /** Page-specific actions, e.g. buttons (placed before notification + theme) */
  actions?: React.ReactNode;
  /** Optional content below the main row (e.g. banners, errors) */
  children?: React.ReactNode;
}

export function TopBar({ title, actions, children }: TopBarProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </div>
          <div className="flex items-center gap-4">
            {actions}
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
