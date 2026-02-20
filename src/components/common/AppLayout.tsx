import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  /** Breadcrumb or header text (left side of top bar) */
  title?: React.ReactNode;
  /** Page-specific actions in the top bar (before notification + theme) */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ title, actions, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 lg:ml-64">
        <TopBar
          title={title}
          actions={actions}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
