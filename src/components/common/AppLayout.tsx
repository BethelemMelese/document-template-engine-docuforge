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
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar title={title} actions={actions} />
        {children}
      </div>
    </div>
  );
}
