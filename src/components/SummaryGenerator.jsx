import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMagic, FaSync, FaCheck } from 'react-icons/fa';
import { generateSummary } from '../utils/summarizer';

const SummaryGenerator = ({ content, onSummaryChange, initialSummary = '' }) => {
  const [summary, setSummary] = useState(initialSummary);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryRatio, setSummaryRatio] = useState(0.3);

  useEffect(() => {
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate processing time for better UX
    setTimeout(() => {
      const generated = generateSummary(content, summaryRatio);
      setSummary(generated);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700 font-medium">
          AI-Generated Summary
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Summary Length: {Math.round(summaryRatio * 100)}%
          </span>
          <input
            type="range"
            min="20"
            max="50"
            value={summaryRatio * 100}
            onChange={(e) => setSummaryRatio(e.target.value / 100)}
            className="w-24"
          />
        </div>
      </div>

      <div className="relative">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full px-3 py-2 border rounded-md h-32 text-sm"
          placeholder="Generated summary will appear here..."
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          disabled={!content || isGenerating}
          className={`absolute right-2 top-2 px-3 py-1 rounded-md text-sm flex items-center gap-2 ${
            isGenerating
              ? 'bg-gray-100 text-gray-400'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isGenerating ? (
            <>
              <FaSync className="animate-spin" />
              Generating...
            </>
          ) : summary ? (
            <>
              <FaSync />
              Regenerate
            </>
          ) : (
            <>
              <FaMagic />
              Generate
            </>
          )}
        </motion.button>

        {summary && !isGenerating && (
          <div className="absolute right-2 bottom-2 text-green-600 text-sm flex items-center gap-1">
            <FaCheck />
            <span>Summary generated</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryGenerator;