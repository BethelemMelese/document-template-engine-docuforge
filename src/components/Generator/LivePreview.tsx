import React from 'react';
import { Card } from '../common/Card';

interface LivePreviewProps {
  content: string;
}

export function LivePreview({ content }: LivePreviewProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {content.length} characters
        </span>
      </div>
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed min-h-[400px] p-4 bg-gray-50 rounded-lg border border-gray-200">
          {content || (
            <p className="text-gray-400 italic">Fill the form to see preview...</p>
          )}
        </div>
      </div>
    </Card>
  );
}
