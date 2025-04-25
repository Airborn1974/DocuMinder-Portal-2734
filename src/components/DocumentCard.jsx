import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaTag, FaUser, FaClock, FaBookReader } from 'react-icons/fa';
import CategoryBadge from './CategoryBadge';

const DocumentCard = ({ document }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{document.title}</h3>
        <CategoryBadge category={document.metadata.category} />
      </div>
      
      <div className="text-gray-600 text-sm mb-3 flex items-center gap-4">
        <span className="flex items-center gap-1">
          <FaUser className="text-gray-400" />
          {document.metadata.author}
        </span>
        <span className="flex items-center gap-1">
          <FaClock className="text-gray-400" />
          {format(document.createdAt, 'MMM d, yyyy')}
        </span>
        <span className="flex items-center gap-1">
          <FaBookReader className="text-gray-400" />
          {document.metadata.readingTime} min read
        </span>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{document.summary}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {document.metadata.tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            <FaTag className="text-blue-600" />
            {tag}
          </span>
        ))}
      </div>

      {document.metadata.keywords.length > 0 && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">Keywords: </span>
          {document.metadata.keywords.join(', ')}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentCard;