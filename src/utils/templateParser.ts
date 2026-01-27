/**
 * Extract all variables from template content
 * Variables are in format: {{variableName}}
 */
export function extractVariables(content: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const variableName = match[1].toLowerCase();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
}

/**
 * Replace variables in template with values
 */
export function mergeTemplate(content: string, variables: Record<string, string>): string {
  let merged = content;
  
  Object.entries(variables).forEach(([key, value]) => {
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
