import React, { useState } from 'react';
import PropTypes from 'prop-types';

const BackgroundSettings = ({ designOptions, setDesignOptions }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image is too large. Maximum size is 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('backgroundImage', file);

      const response = await fetch('/api/upload-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Update design options with the new background image URL
      setDesignOptions({
        ...designOptions,
        backgroundImage: {
          ...designOptions.backgroundImage,
          url: data.url
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDisplayChange = (e) => {
    setDesignOptions({
      ...designOptions,
      backgroundImage: {
        ...designOptions.backgroundImage,
        display: e.target.value
      }
    });
  };

  const handleOpacityChange = (e) => {
    setDesignOptions({
      ...designOptions,
      backgroundImage: {
        ...designOptions.backgroundImage,
        opacity: parseFloat(e.target.value)
      }
    });
  };

  const handleClearBackground = () => {
    setDesignOptions({
      ...designOptions,
      backgroundImage: {
        url: '',
        display: 'none',
        opacity: 1
      }
    });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-medium text-gray-800 mb-3">Background Image</h3>
      
      <div className="space-y-4">
        {/* Background preview */}
        {designOptions.backgroundImage?.url && (
          <div className="relative">
            <div 
              className="h-32 w-full bg-cover bg-center rounded-md"
              style={{ 
                backgroundImage: `url(${designOptions.backgroundImage.url})`,
                opacity: designOptions.backgroundImage.opacity || 1
              }}
            ></div>
            <button
              onClick={handleClearBackground}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Upload input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Background Image
          </label>
          <input
            type="file"
            onChange={handleBackgroundImageUpload}
            accept="image/jpeg, image/png, image/gif, image/webp"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="mt-2 text-blue-600 text-sm flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          )}
          {uploadError && (
            <div className="mt-2 text-red-600 text-sm">{uploadError}</div>
          )}
        </div>
        
        {/* Display options */}
        {designOptions.backgroundImage?.url && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Style
              </label>
              <select
                value={designOptions.backgroundImage.display || 'none'}
                onChange={handleDisplayChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No Background</option>
                <option value="tile">Tiled Background</option>
                <option value="fullscreen">Fullscreen Background</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Opacity: {designOptions.backgroundImage.opacity || 1}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={designOptions.backgroundImage.opacity || 1}
                onChange={handleOpacityChange}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

BackgroundSettings.propTypes = {
  designOptions: PropTypes.object.isRequired,
  setDesignOptions: PropTypes.func.isRequired
};

export default BackgroundSettings;
