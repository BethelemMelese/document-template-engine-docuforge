export function htmlToText(html: string): string {
  if (!html) return '';
  // If it doesn't look like HTML, return as-is.
  if (!html.includes('<')) return html;

  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').replace(/\u00a0/g, ' ');
}

