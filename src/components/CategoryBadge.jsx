import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaFileAlt, FaFileInvoiceDollar, FaFileCode, 
  FaFileContract, FaFileAudio, FaUserTie 
} from 'react-icons/fa';

const categoryIcons = {
  financial: FaFileInvoiceDollar,
  technical: FaFileCode,
  legal: FaFileContract,
  marketing: FaFileAudio,
  hr: FaUserTie,
  uncategorized: FaFileAlt
};

const categoryColors = {
  financial: 'bg-green-100 text-green-800',
  technical: 'bg-blue-100 text-blue-800',
  legal: 'bg-purple-100 text-purple-800',
  marketing: 'bg-yellow-100 text-yellow-800',
  hr: 'bg-red-100 text-red-800',
  uncategorized: 'bg-gray-100 text-gray-800'
};

const CategoryBadge = ({ category }) => {
  const Icon = categoryIcons[category] || categoryIcons.uncategorized;
  const colorClass = categoryColors[category] || categoryColors.uncategorized;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm ${colorClass}`}
    >
      <Icon className="text-sm" />
      <span className="capitalize">{category}</span>
    </motion.span>
  );
};

export default CategoryBadge;