import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailApply } from '../components/EmailApply/EmailApply';
import { Sidebar } from '../components/common/Sidebar';
import { Button } from '../components/common/Button';

export function EmailApplyScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { content, company, position, email } = location.state || {
    content: '',
    company: '',
    position: '',
    email: '',
  };

  const [emailValue, setEmailValue] = useState(email || '');

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-2">No Content Found</p>
          <p className="text-gray-600 mb-6">Please generate a cover letter first before proceeding to email.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500">
                Dashboard / Templates / Email Application
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(-1)} size="sm">
                  ← Back
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} size="sm">
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Send Your Application</h2>
            <p className="text-gray-600">
              Choose your preferred email client to send your cover letter.
            </p>
          </div>
          <EmailApply
            company={company}
            position={position}
            email={emailValue}
            content={content}
            onEmailChange={setEmailValue}
          />
        </div>
      </div>
    </div>
  );
}
