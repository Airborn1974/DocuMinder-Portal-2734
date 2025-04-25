// Common category patterns and their associated keywords
const categoryPatterns = {
  financial: ['invoice', 'payment', 'budget', 'expense', 'revenue', 'financial', 'tax'],
  technical: ['code', 'documentation', 'api', 'system', 'technical', 'software', 'database'],
  legal: ['contract', 'agreement', 'legal', 'compliance', 'policy', 'regulation'],
  marketing: ['campaign', 'promotion', 'marketing', 'advertisement', 'social media', 'brand'],
  hr: ['employee', 'recruitment', 'hiring', 'hr', 'personnel', 'training'],
};

export const suggestCategories = (content, title) => {
  const text = `${title} ${content}`.toLowerCase();
  const matches = new Map();

  Object.entries(categoryPatterns).forEach(([category, keywords]) => {
    const matchCount = keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    if (matchCount > 0) {
      matches.set(category, matchCount);
    }
  });

  return Array.from(matches.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
};

export const getTopCategory = (content, title) => {
  const suggestions = suggestCategories(content, title);
  return suggestions.length > 0 ? suggestions[0] : 'uncategorized';
};