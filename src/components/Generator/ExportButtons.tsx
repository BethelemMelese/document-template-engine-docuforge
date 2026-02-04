import React, { useState } from 'react';
import { Button } from '../common/Button';
import { exportToPDF } from '../../utils/exportToPDF';
import { exportToDOCX } from '../../utils/exportToDOCX';
import { copyToClipboard } from '../../utils/emailGenerator';
import { htmlToText } from '../../utils/htmlToText';

interface ExportButtonsProps {
  content: string;
  company: string;
  position: string;
  onEdit?: () => void;
}

export function ExportButtons({ content, company, position, onEdit }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleExportPDF = () => {
    const filename = `Cover-Letter-${company.replace(/\s+/g, '-')}-${position.replace(/\s+/g, '-')}.pdf`;
    exportToPDF(htmlToText(content), filename);
  };

  const handleExportDOCX = async () => {
    const filename = `Cover-Letter-${company.replace(/\s+/g, '-')}-${position.replace(/\s+/g, '-')}.docx`;
    await exportToDOCX(htmlToText(content), filename);
  };

  const handleCopyToClipboard = async () => {
    await copyToClipboard(htmlToText(content));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <Button onClick={handleExportPDF} className="w-full" size="lg">
        Download PDF
      </Button>
      <Button onClick={handleExportDOCX} variant="outline" className="w-full" size="lg">
        Download DOCX
      </Button>
      <Button onClick={handleCopyToClipboard} variant="secondary" className="w-full" size="lg">
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </Button>
      {onEdit && (
        <Button onClick={onEdit} variant="ghost" className="w-full" size="lg">
          Edit Variables
        </Button>
      )}
    </div>
  );
}
