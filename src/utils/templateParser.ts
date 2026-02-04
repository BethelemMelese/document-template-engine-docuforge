/**
 * Extract all variables from template content
 * Variables are in format: {{variableName}}
 * Works with both HTML and plain text
 */
export function extractVariables(content: string): string[] {
  // Create a temporary DOM element to strip HTML tags if content is HTML
  let textContent = content;
  if (content.includes('<')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  }
  
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(textContent)) !== null) {
    const variableName = match[1].toLowerCase();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Count how many times a variable appears in content
 */
export function countVariableUsage(content: string, variableName: string): number {
  let textContent = content;
  if (content.includes('<')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    textContent = tempDiv.textContent || tempDiv.innerText || '';
  }
  
  const regex = new RegExp(`\\{\\{${variableName}\\}\\}`, 'gi');
  const matches = textContent.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Replace variables in template with values
 * Works with HTML content, preserving formatting
 */
export function mergeTemplate(content: string, variables: Record<string, string>): string {
  let merged = content;
  
  Object.entries(variables).forEach(([key, value]) => {
    // Replace in HTML, preserving tags
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
    merged = merged.replace(regex, value);
  });

  return merged;
}

/**
 * Check if content has variables
 */
export function hasVariables(content: string): boolean {
  return /\{\{(\w+)\}\}/.test(content);
}
