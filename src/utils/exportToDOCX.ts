import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function exportToDOCX(content: string, filename: string = 'cover-letter.docx'): Promise<void> {
  // Split content into paragraphs (by double newlines or single newlines)
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  const docParagraphs = paragraphs.map(para => {
    // Split by single newlines within paragraph
    const lines = para.split('\n').filter(l => l.trim().length > 0);
    
    return new Paragraph({
      children: lines.map(line => new TextRun(line)),
      spacing: { after: 200 },
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
