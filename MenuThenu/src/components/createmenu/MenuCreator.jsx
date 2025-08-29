// pages/MenuCreator.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateSelection from './TemplateSelection';
import MenuUpload from './MenuUpload';
import MenuPreview from './MenuPreview';
import BackgroundSettings from './BackgroundSettings';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

const MenuCreator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [menuData, setMenuData] = useState({
    name: '',
    items: []
  });
  
  const [designOptions, setDesignOptions] = useState({
    font: 'sans-serif',
    color: {
      background: '#ffffff',
      text: '#000000',
      accent: '#3b82f6',
      secondaryText: '#666666'
    },
    backgroundImage: {
      url: '',
      display: 'none',
      opacity: 1
    }
  });
  
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const [savedMenuId, setSavedMenuId] = useState(null);
  const [subdomain, setSubdomain] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const qrCodeRef = useRef(null);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Apply template's default colors based on the template name
    if (template.name === 'Classic Diner') {
      setDesignOptions({
        ...designOptions,
        color: {
          background: '#f5f5f5',
          text: '#333333',
          accent: '#8b5a2b',
          secondaryText: '#666666'
        }
      });
    } else if (template.name === 'Modern Bistro') {
      setDesignOptions({
        ...designOptions,
        color: {
          background: '#ffffff',
          text: '#222222',
          accent: '#000000',
          secondaryText: '#777777'
        }
      });
    } else if (template.name === 'Cozy Cafe') {
      setDesignOptions({
        ...designOptions,
        color: {
          background: '#f8f4e8',
          text: '#44332e',
          accent: '#a67c52',
          secondaryText: '#7d6b66'
        }
      });
    } else if (template.name === 'Family Restaurant') {
      setDesignOptions({
        ...designOptions,
        color: {
          background: '#ffffff',
          text: '#222222',
          accent: '#e63946',
          secondaryText: '#457b9d'
        }
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1 && !selectedTemplate) {
      alert('Please select a template to continue');
      return;
    }
    if (step === 2 && (!menuData.name || menuData.items.length === 0)) {
      alert('Please add a menu name and at least one item');
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSaveMenu = async () => {
    try {
      setSaveStatus({ loading: true, error: null, success: false });
      
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setSaveStatus({ 
          loading: false, 
          error: 'You must be logged in to save a menu. Please log in and try again.', 
          success: false 
        });
        return;
      }
      
      // First, create the menu with authentication
      const menuResponse = await fetch('/api/menus', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: menuData.name,
          template: selectedTemplate.name,
          customization: designOptions
        })
      });
      
      if (!menuResponse.ok) {
        const errorData = await menuResponse.json();
        throw new Error(errorData.error || 'Failed to save menu');
      }
      
      const savedMenu = await menuResponse.json();
      setSavedMenuId(savedMenu._id);
      
      if (savedMenu.subdomain) {
        setSubdomain(savedMenu.subdomain);
      }
      
      // Then, add the menu items
      const itemsResponse = await fetch(`/api/menus/${savedMenu._id}/items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: menuData.items })
      });
      
      if (!itemsResponse.ok) {
        throw new Error('Failed to save menu items');
      }
      
      // Publish the menu
      const publishResponse = await fetch(`/api/menus/${savedMenu._id}/publish`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isPublished: true })
      });
      
      if (!publishResponse.ok) {
        throw new Error('Failed to publish menu');
      }
      
      const publishedMenu = await publishResponse.json();
      setSubdomain(publishedMenu.subdomain);
      
      setSaveStatus({ loading: false, error: null, success: true });
      
      // Show QR code modal
      setShowQRModal(true);
      
    } catch (error) {
      setSaveStatus({ 
        loading: false, 
        error: error.message || 'Failed to save menu', 
        success: false 
      });
    }
  };

  const handlePrintQRCode = async () => {
    if (!qrCodeRef.current) return;
    
    try {
      const canvas = await html2canvas(qrCodeRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Menu QR Code - ${menuData.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .container {
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
              }
              h2 {
                color: #333;
              }
              .instructions {
                font-size: 12px;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>${menuData.name} Menu</h2>
              <div>
                <img src="${imgData}" alt="QR Code" style="max-width: 300px;" />
              </div>
              <p style="margin-top: 15px;">
                Scan this QR code to view our digital menu
              </p>
              <p style="color: #666; font-size: 14px;">
                URL: http://${subdomain}.menuthenu.com
              </p>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    } catch (err) {
      console.error('Error printing QR code:', err);
    }
  };

  // QR Code Modal Component
  const QRCodeModal = () => {
    if (!showQRModal) return null;
    
    const menuUrl = `http://${subdomain}.menuthenu.com`;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu Published!</h3>
            <button 
              onClick={() => setShowQRModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-4">
              Your menu is now published and accessible at:
            </p>
            <a 
              href={menuUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {menuUrl}
            </a>
          </div>
          
          <div ref={qrCodeRef} className="flex justify-center my-6 p-4 bg-white">
            <QRCode 
              value={menuUrl} 
              size={200}
              level="H"
              includeMargin={true}
              renderAs="canvas"
            />
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Share this QR code with your customers to provide easy access to your digital menu
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrintQRCode}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print QR Code
            </button>
            
            <button
              onClick={() => {
                setShowQRModal(false);
                navigate('/admin/menulist');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Menu List
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Menu</h1>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-sm mt-2">Select Template</span>
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-sm mt-2">Add Menu Data</span>
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-sm mt-2">Customize & Preview</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          <TemplateSelection 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />
          <div className="flex justify-end mt-8">
            <button 
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next: Add Menu Data
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Menu Data */}
      {step === 2 && (
        <div>
          <MenuUpload 
            menuData={menuData}
            setMenuData={setMenuData}
          />
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePreviousStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back: Select Template
            </button>
            <button 
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next: Customize & Preview
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Customize & Preview */}
      {step === 3 && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-2 h-6 bg-blue-600 mr-2"></div>
                <h3 className="font-semibold">Design Options</h3>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={designOptions.font}
                  onChange={(e) => setDesignOptions({...designOptions, font: e.target.value})}
                >
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="cursive">Cursive</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <label className="inline-block w-24 text-xs text-gray-500">Background</label>
                    <input 
                      type="color" 
                      value={designOptions.color.background}
                      onChange={(e) => setDesignOptions({
                        ...designOptions,
                        color: {...designOptions.color, background: e.target.value}
                      })}
                      className="h-8 w-8 p-0 border border-gray-300"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="inline-block w-24 text-xs text-gray-500">Text</label>
                    <input 
                      type="color" 
                      value={designOptions.color.text}
                      onChange={(e) => setDesignOptions({
                        ...designOptions,
                        color: {...designOptions.color, text: e.target.value}
                      })}
                      className="h-8 w-8 p-0 border border-gray-300"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="inline-block w-24 text-xs text-gray-500">Accent</label>
                    <input 
                      type="color" 
                      value={designOptions.color.accent}
                      onChange={(e) => setDesignOptions({
                        ...designOptions,
                        color: {...designOptions.color, accent: e.target.value}
                      })}
                      className="h-8 w-8 p-0 border border-gray-300"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="inline-block w-24 text-xs text-gray-500">Secondary</label>
                    <input 
                      type="color" 
                      value={designOptions.color.secondaryText}
                      onChange={(e) => setDesignOptions({
                        ...designOptions,
                        color: {...designOptions.color, secondaryText: e.target.value}
                      })}
                      className="h-8 w-8 p-0 border border-gray-300"
                    />
                  </div>
                </div>
              </div>
              
              {/* Background Image Settings */}
              <BackgroundSettings 
                designOptions={designOptions}
                setDesignOptions={setDesignOptions}
              />
            </div>
            
            <div className="lg:col-span-2">
              <MenuPreview 
                selectedTemplate={selectedTemplate}
                menuData={menuData}
                designOptions={designOptions}
              />
            </div>
          </div>
          
          {/* Save status */}
          {saveStatus.error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{saveStatus.error}</p>
            </div>
          )}
          
          {saveStatus.success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p>Menu saved and published successfully!</p>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            <button 
              onClick={handlePreviousStep}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back: Add Menu Data
            </button>
            <button 
              onClick={handleSaveMenu}
              disabled={saveStatus.loading || saveStatus.success}
              className={`px-6 py-2 rounded-md ${
                saveStatus.loading || saveStatus.success
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {saveStatus.loading ? 'Saving...' : 'Save & Publish Menu'}
            </button>
          </div>
        </div>
      )}
      
      {/* QR Code Modal */}
      <QRCodeModal />
    </div>
  );
};

export default MenuCreator;