import jsPDF from 'jspdf';

export function exportToPDF(content: string, filename: string = 'cover-letter.pdf'): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Split content into lines that fit the page width
  const lines = doc.splitTextToSize(content, maxWidth);
  
  let y = margin;
  const lineHeight = 7;
  
  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  
  doc.save(filename);
}
