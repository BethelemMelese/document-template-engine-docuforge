import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { generateMailtoLink, generateEmailSubject, copyToClipboard } from '../../utils/emailGenerator';

interface EmailApplyProps {
  company: string;
  position: string;
  email: string;
  content: string;
  onEmailChange?: (email: string) => void;
}

export function EmailApply({ company, position, email, content, onEmailChange }: EmailApplyProps) {
  const [localEmail, setLocalEmail] = useState(email);
  const [copied, setCopied] = useState(false);
  
  const currentEmail = onEmailChange ? localEmail : email;
  
  const subject = generateEmailSubject(position);
  const mailtoLink = generateMailtoLink({
    to: currentEmail || 'hr@company.com',
    subject,
    body: content,
  });

  const handleEmailChange = (value: string) => {
    setLocalEmail(value);
    if (onEmailChange) {
      onEmailChange(value);
    }
  };

  const handleOpenGmail = () => {
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(currentEmail || 'hr@company.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    window.open(gmailLink, '_blank');
  };

  const handleOpenOutlook = () => {
    const outlookLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(currentEmail || 'hr@company.com')}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    window.open(outlookLink, '_blank');
  };

  const handleCopyEmail = async () => {
    const emailText = `To: ${currentEmail || 'hr@company.com'}\nSubject: ${subject}\n\n${content}`;
    await copyToClipboard(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Application</h2>
          <p className="text-sm text-gray-500">Review and send your cover letter via email</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To: <span className="text-gray-400">(Hiring Manager Email)</span>
            </label>
            <input
              type="email"
              value={currentEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="hr@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
            <input
              type="text"
              value={subject}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body:</label>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {content}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleOpenGmail} className="w-full" size="lg">
            <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
            Open in Gmail
          </Button>
          <Button onClick={handleOpenOutlook} variant="outline" className="w-full" size="lg">
            <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.5 7.5h9v9h-9v-9zm-1.5 0C6 5.57 6.57 5 7.5 5h9C17.43 5 18 5.57 18 6.5v9c0 .93-.57 1.5-1.5 1.5h-9C5.57 17 5 16.43 5 15.5v-9zM4 6v12H0V6h4zm16 0v12h-4V6h4z"/>
            </svg>
            Open in Outlook
          </Button>
          <Button onClick={() => window.location.href = mailtoLink} variant="secondary" className="w-full" size="lg">
            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Open in Default Email Client
          </Button>
          <Button onClick={handleCopyEmail} variant="ghost" className="w-full" size="lg">
            {copied ? (
              <>
                <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Email Content
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
