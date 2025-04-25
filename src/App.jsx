import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DocumentForm from './components/DocumentForm';
import DocumentCard from './components/DocumentCard';
import DocumentUpload from './components/DocumentUpload';
import SearchFilters from './components/SearchFilters';
import { archiveDb } from './services/ArchiveDatabase';
import { Document, DocumentMetadata } from './types/Document';

function App() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleDocumentSubmit = (document) => {
    const savedDocument = archiveDb.add(document);
    setDocuments([savedDocument, ...documents]);
  };

  const handleUploadComplete = (uploadedFiles) => {
    // Process uploaded files into documents
    const newDocuments = uploadedFiles.map(file => {
      const metadata = new DocumentMetadata(
        [],
        'Uploaded User',
        'uploaded',
        [],
        `Uploaded document: ${file.name}`
      );

      return new Document(
        file.id,
        file.name,
        file.content,
        metadata,
        `Automatically uploaded document: ${file.name}`
      );
    });

    newDocuments.forEach(doc => archiveDb.add(doc));
    setDocuments([...newDocuments, ...documents]);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = term ? archiveDb.search(term, filters) : archiveDb.getAll();
    setDocuments(results);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const results = searchTerm 
      ? archiveDb.search(searchTerm, newFilters)
      : archiveDb.getAll();
    setDocuments(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Document Management System
        </motion.h1>

        <div className="space-y-6">
          <DocumentUpload onUploadComplete={handleUploadComplete} />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <DocumentForm onSubmit={handleDocumentSubmit} />
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <SearchFilters
              categories={archiveDb.getCategories()}
              authors={archiveDb.getAuthors()}
              dateRange={archiveDb.getDateRange()}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="mt-6">
            {documents.map(document => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {documents.length === 0 && (
              <p className="text-center text-gray-500">No documents found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;