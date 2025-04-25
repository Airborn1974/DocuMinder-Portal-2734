export const generateMetaTags = (content, title) => {
  // Extract key phrases (3-4 words)
  const phrases = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .reduce((acc, word, i, arr) => {
      if (i < arr.length - 2) {
        acc.push(arr.slice(i, i + 3).join(' '));
      }
      return acc;
    }, []);

  // Extract important single words
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'have'].includes(word));

  // Combine title words with content words
  const titleWords = title.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Generate SEO description
  const description = content
    .split('.')[0]
    .trim()
    .substring(0, 155);

  return {
    keywords: [...new Set([...titleWords, ...words])].slice(0, 10),
    phrases: [...new Set(phrases)].slice(0, 5),
    description,
    readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
  };
};