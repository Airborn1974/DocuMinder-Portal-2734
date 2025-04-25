import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';

const MetaTagsEditor = ({ initialMeta, onChange, content, title }) => {
  const [keywords, setKeywords] = useState(initialMeta?.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  const [description, setDescription] = useState(initialMeta?.description || '');

  useEffect(() => {
    onChange({ keywords, description });
  }, [keywords, description, onChange]);

  const addKeyword = (e) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (indexToRemove) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Meta Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md h-20 text-sm"
          placeholder="Enter SEO description (max 155 characters)"
          maxLength={155}
        />
        <div className="text-right text-xs text-gray-500">
          {description.length}/155
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Keywords
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {keywords.map((keyword, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>
        <form onSubmit={addKeyword} className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 px-3 py-1 border rounded-md text-sm"
            placeholder="Add keyword"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <FaPlus className="w-3 h-3" /> Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default MetaTagsEditor;