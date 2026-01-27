import { extractVariables } from '../../utils/templateParser';

export function detectAndHighlightVariables(html: string): string {
  // Extract variables from the HTML content
  const textContent = html.replace(/<[^>]*>/g, '');
  const variables = extractVariables(textContent);
  
  // Replace {{variable}} with highlighted spans
  let highlighted = html;
  variables.forEach(variable => {
    const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'gi');
    highlighted = highlighted.replace(
      regex,
      `<span data-variable="${variable}" class="variable-mark">{{${variable}}}</span>`
    );
  });
  
  return highlighted;
}
