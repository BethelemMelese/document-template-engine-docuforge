import React from 'react';
import { Button } from '../common/Button';
import { exportToPDF } from '../../utils/exportToPDF';
import { exportToDOCX } from '../../utils/exportToDOCX';
import { copyToClipboard } from '../../utils/emailGenerator';

interface ExportButtonsProps {
  content: string;
  company: string;
  position: string;
  onEdit?: () => void;
}

export function ExportButtons({ content, company, position, onEdit }: ExportButtonsProps) {
  const handleExportPDF = () => {
    const filename = `Cover-Letter-${company.replace(/\s+/g, '-')}-${position.replace(/\s+/g, '-')}.pdf`;
    exportToPDF(content, filename);
  };

  const handleExportDOCX = async () => {
    const filename = `Cover-Letter-${company.replace(/\s+/g, '-')}-${position.replace(/\s+/g, '-')}.docx`;
    await exportToDOCX(content, filename);
  };

  const handleCopyToClipboard = async () => {
    await copyToClipboard(content);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleExportPDF} className="w-full" size="lg">
        Download PDF
      </Button>
      <Button onClick={handleExportDOCX} variant="outline" className="w-full" size="lg">
        Download DOCX
      </Button>
      <Button onClick={handleCopyToClipboard} variant="secondary" className="w-full" size="lg">
        Copy to Clipboard
      </Button>
      {onEdit && (
        <Button onClick={onEdit} variant="ghost" className="w-full" size="lg">
          Edit Variables
        </Button>
      )}
    </div>
  );
}
