export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export function generateMailtoLink(data: EmailData): string {
  const { to, subject, body } = data;
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
}

export function generateEmailSubject(position: string): string {
  return `Application for ${position}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
