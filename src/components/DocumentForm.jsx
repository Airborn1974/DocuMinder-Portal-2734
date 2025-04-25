import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Document, DocumentMetadata } from '../types/Document';
import { suggestCategories } from '../utils/categorization';
import { generateMetaTags } from '../utils/metaGenerator';
import MetaTagsEditor from './MetaTagsEditor';
import SummaryGenerator from './SummaryGenerator';

const DocumentForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [metaTags, setMetaTags] = useState({ keywords: [], description: '' });

  useEffect(() => {
    if (title || content) {
      const suggestions = suggestCategories(content, title);
      setSuggestedCategories(suggestions);

      const generated = generateMetaTags(content, title);
      setMetaTags(prev => ({
        keywords: prev.keywords.length ? prev.keywords : generated.keywords,
        description: prev.description || generated.description
      }));
    }
  }, [title, content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const metadata = new DocumentMetadata(
      tags.split(',').map(tag => tag.trim()),
      author,
      category || suggestedCategories[0] || 'uncategorized',
      metaTags.keywords,
      metaTags.description
    );
    
    const generated = generateMetaTags(content, title);
    metadata.setReadingTime(generated.readingTime);
    
    const document = new Document(
      Date.now().toString(),
      title,
      content,
      metadata,
      summary
    );

    onSubmit(document);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setAuthor('');
    setCategory('');
    setSummary('');
    setSuggestedCategories([]);
    setMetaTags({ keywords: [], description: '' });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-md h-32"
          required
        />
      </div>

      <div className="mb-4">
        <SummaryGenerator
          content={content}
          onSummaryChange={setSummary}
          initialSummary={summary}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-gray-700 font-medium mb-2">Meta Tags</h3>
        <MetaTagsEditor
          initialMeta={metaTags}
          onChange={setMetaTags}
          content={content}
          title={title}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
            {suggestedCategories.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (Suggested: {suggestedCategories[0]})
              </span>
            )}
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder={suggestedCategories[0] || "Enter category"}
          />
          {suggestedCategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedCategories.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setCategory(suggestion)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Separate with commas"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Save Document
      </motion.button>
    </motion.form>
  );
};

export default DocumentForm;