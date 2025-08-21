import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FileUploader = ({ onDataExtracted, setIsLoading }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const allowedFileTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/jpeg',
    'image/png'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setErrorMessage('Invalid file type. Please upload an Excel file, CSV, JPG, or PNG image.');
      setFile(null);
      return;
    }
    
    setErrorMessage('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await fetch('/api/extract-menu', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract data');
      }

      const data = await response.json();
      onDataExtracted(data.items);
      
      // Reset progress after 1 second
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while processing your file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-6 bg-blue-600 mr-2"></div>
        <h3 className="font-semibold">Upload and Extract Data</h3>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Excel, CSV, or Image File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv,.jpg,.jpeg,.png"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
      
      {file && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
        </div>
      )}
      
      {uploadProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {uploadProgress < 100 ? 'Processing...' : 'Completed!'}
          </p>
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={!file || uploadProgress > 0}
        className={`px-4 py-2 rounded-md text-white ${
          !file || uploadProgress > 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Extract Data
      </button>
      
      <p className="mt-4 text-xs text-gray-500">
        Supported file types: Excel (.xlsx, .xls), CSV, Images (.jpg, .png)
      </p>
    </div>
  );
};

FileUploader.propTypes = {
  onDataExtracted: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired
};

export default FileUploader;
