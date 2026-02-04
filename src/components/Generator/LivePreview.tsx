import React from 'react';
import { Card } from '../common/Card';

interface LivePreviewProps {
  content: string;
}

export function LivePreview({ content }: LivePreviewProps) {
  return (
    <Card className="h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Preview</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {content.length} characters
        </span>
      </div>
      <div className="prose max-w-none dark:prose-invert">
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed min-h-[400px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {content ? (
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-400 dark:text-gray-500 italic">Fill the form to see preview...</p>
          )}
        </div>
      </div>
    </Card>
  );
}
