import React from 'react';
import { Card } from '../common/Card';

interface VariablePanelProps {
  variables: string[];
}

export function VariablePanel({ variables }: VariablePanelProps) {
  if (variables.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Variables</h3>
        <p className="text-sm text-gray-500">
          Variables will appear here when you use <code className="bg-gray-100 px-1 rounded">{'{{variableName}}'}</code> format in your template.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Variables</h3>
      <p className="text-sm text-gray-500 mb-4">
        These fields will be filled when generating the final letter.
      </p>
      <div className="space-y-2">
        {variables.map((variable) => (
          <div
            key={variable}
            className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
          >
            <span className="text-sm font-mono text-blue-700 font-medium">
              {`{{${variable}}}`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
