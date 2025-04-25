import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaLink, FaFileAlt, FaTimes } from 'react-icons/fa';

const DocumentUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUrlImport = (e) => {
    e.preventDefault();
    setUrlError('');
    
    try {
      new URL(urlInput);
      const urlFile = {
        id: `url-${Date.now()}`,
        name: `imported-from-url-${Date.now()}`,
        type: 'text/html',
        size: 0,
        lastModified: Date.now(),
        content: urlInput,
        isUrl: true
      };
      
      setFiles([...files, urlFile]);
      setUrlInput('');
    } catch (err) {
      setUrlError('Please enter a valid URL (include http:// or https://)');
    }
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    const processedDocuments = files.map(file => ({
      id: file.id || `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      content: file.isUrl ? file.content : URL.createObjectURL(file),
      isUrl: file.isUrl || false
    }));

    onUploadComplete(processedDocuments);
    setFiles([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'file' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('file')}
        >
          File Upload
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('url')}
        >
          URL Import
        </button>
      </div>

      {activeTab === 'file' ? (
        <>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600 mb-1">Drag & drop files here or click to browse</p>
            <p className="text-sm text-gray-400">Supports PDF, DOCX, JPG, PNG (Max 10MB each)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Selected Files ({files.length})</h3>
              <ul className="border rounded-lg divide-y">
                {files.map((file, index) => (
                  <li key={index} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {file.isUrl ? 'URL' : `${(file.size / 1024).toFixed(1)} KB • ${file.type}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="p-4">
          <form onSubmit={handleUrlImport} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Document URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <FaLink /> Import URL
            </button>
          </form>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Imported URLs ({files.length})</h3>
              <ul className="border rounded-lg divide-y">
                {files.map((file, index) => (
                  <li key={index} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaLink className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500 break-all">{file.content}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FaUpload /> Upload {files.length} {files.length === 1 ? 'Item' : 'Items'}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;