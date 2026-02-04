import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

interface ProjectSidebarProps {
  projectName?: string;
  currentView?: 'editor' | 'variables' | 'settings' | 'history';
}

export function ProjectSidebar({ projectName = 'Untitled Project', currentView = 'editor' }: ProjectSidebarProps) {
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Editor',
      view: 'editor' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: 'Variables',
      view: 'variables' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      name: 'Settings',
      view: 'settings' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Version History',
      view: 'history' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Current Project */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Project</p>
        <p className="text-sm font-medium text-gray-900">{projectName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <li key={item.view}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pro Plan Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary-600 rounded-lg p-4 text-white">
          <p className="text-xs font-semibold uppercase mb-1">Pro Plan</p>
          <p className="text-xs mb-3 opacity-90">
            Unlock unlimited AI suggestions and bulk exports.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-white text-primary-600 hover:bg-gray-100"
            onClick={() => {}}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
