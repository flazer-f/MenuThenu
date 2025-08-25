import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SubdomainManager = ({ menu, onUpdate }) => {
  const [subdomain, setSubdomain] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidFormat, setIsValidFormat] = useState(true);
  
  // Base domain for display purposes
  const baseDomain = process.env.BASE_DOMAIN || 'menuthenu.com';

  useEffect(() => {
    if (menu) {
      setSubdomain(menu.subdomain || '');
      setIsPublished(menu.isPublished || false);
    }
  }, [menu]);

  const validateSubdomain = (value) => {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(value);
  };

  const handleSubdomainChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSubdomain(value);
    setIsValidFormat(validateSubdomain(value));
    setError('');
    setSuccess('');
  };

  const handlePublishToggle = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/menus/${menu._id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: !isPublished })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update published status');
      }
      
      const updatedMenu = await response.json();
      setIsPublished(updatedMenu.isPublished);
      if (onUpdate) onUpdate(updatedMenu);
      
      setSuccess(updatedMenu.isPublished 
        ? 'Menu published successfully!' 
        : 'Menu unpublished successfully!'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubdomain = async () => {
    if (!subdomain) {
      setError('Subdomain is required');
      return;
    }
    
    if (!isValidFormat) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/menus/${menu._id}/subdomain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subdomain })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save subdomain');
      }
      
      const updatedMenu = await response.json();
      if (onUpdate) onUpdate(updatedMenu);
      
      setSuccess('Subdomain saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!menu) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold mb-4">Menu Publishing</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Subdomain
        </label>
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              value={subdomain}
              onChange={handleSubdomainChange}
              placeholder="your-restaurant"
              className={`w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 ${
                !isValidFormat && subdomain
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500">.{baseDomain}</span>
            </div>
          </div>
          <button
            onClick={handleSaveSubdomain}
            disabled={loading || !isValidFormat}
            className={`ml-2 px-4 py-2 rounded-md ${
              loading || !isValidFormat
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
        {!isValidFormat && subdomain && (
          <p className="mt-1 text-sm text-red-600">
            Subdomain can only contain lowercase letters, numbers, and hyphens
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Your menu will be accessible at: 
          <a 
            href={`http://${subdomain || 'your-restaurant'}.${baseDomain}`}
            target="_blank" 
            rel="noopener noreferrer"
            className={`ml-1 ${subdomain ? 'text-blue-600 hover:underline' : 'text-gray-500'}`}
          >
            {subdomain || 'your-restaurant'}.{baseDomain}
          </a>
        </p>
      </div>
      
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="font-medium">Publish Menu</h3>
          <p className="text-sm text-gray-500">
            {isPublished 
              ? 'Your menu is currently published and accessible to customers.' 
              : 'Publish your menu to make it accessible to customers.'}
          </p>
        </div>
        <div className="relative inline-block w-12 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id="publish-toggle"
            checked={isPublished}
            onChange={handlePublishToggle}
            disabled={loading}
            className="sr-only"
          />
          <label
            htmlFor="publish-toggle"
            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: isPublished ? '#4ade80' : '#e5e7eb',
              transition: 'background-color 0.3s ease'
            }}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white shadow transform ${
                isPublished ? 'translate-x-6' : 'translate-x-0'
              }`}
              style={{ transition: 'transform 0.3s ease' }}
            ></span>
          </label>
        </div>
      </div>
      
      {isPublished && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Public Menu URL</h3>
          <div className="p-3 bg-gray-50 rounded-md flex items-center justify-between">
            <a
              href={`http://${menu.subdomain || 'your-restaurant'}.${baseDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {menu.subdomain || 'your-restaurant'}.{baseDomain}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`http://${menu.subdomain || 'your-restaurant'}.${baseDomain}`);
                setSuccess('URL copied to clipboard!');
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

SubdomainManager.propTypes = {
  menu: PropTypes.object,
  onUpdate: PropTypes.func
};

export default SubdomainManager;
