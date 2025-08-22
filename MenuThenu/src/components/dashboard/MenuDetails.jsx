import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SubdomainManager from './SubdomainManager';
import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode.react';

const MenuDetails = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [menuHtml, setMenuHtml] = useState('');
  const printFrameRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const response = await fetch(`/api/menus/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch menu details');
        }
        
        const data = await response.json();
        setMenu(data.menu);
        setItems(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuDetails();
    }
  }, [id]);

  const handleMenuUpdate = (updatedMenu) => {
    setMenu(updatedMenu);
  };

  // Function to fetch the menu HTML for printing
  const fetchMenuHtml = async () => {
    try {
      if (!menu || !menu.subdomain) {
        throw new Error('Menu subdomain not set');
      }

      const response = await fetch(`/api/menus/${id}/render`);
      if (!response.ok) {
        throw new Error('Failed to generate menu HTML');
      }

      const htmlText = await response.text();
      setMenuHtml(htmlText);
      return htmlText;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Handle print menu
  const handlePrintMenu = async () => {
    const html = await fetchMenuHtml();
    if (!html) return;

    const options = {
      margin: 10,
      filename: `${menu.name}-menu.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(html).set(options).save();
  };

  // Handle submit and publish
  const handleSubmitAndPublish = async () => {
    try {
      // Ensure the menu is published first
      if (!menu.isPublished) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const publishResponse = await fetch(`/api/menus/${id}/publish`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isPublished: true })
        });
        
        if (!publishResponse.ok) {
          const data = await publishResponse.json();
          throw new Error(data.error || 'Failed to publish menu');
        }
        
        const updatedMenu = await publishResponse.json();
        setMenu(updatedMenu);
      }
      
      // Show QR code modal
      setShowQRCode(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle print QR code
  const handlePrintQRCode = () => {
    const content = qrCodeRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Menu QR Code - ${menu.name}</title>
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
            .qr-code {
              margin: 20px 0;
            }
            .url {
              color: #666;
              word-break: break-all;
              margin: 15px 0;
              font-size: 14px;
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
            <h2>${menu.name} Menu</h2>
            <div class="qr-code">
              ${content.innerHTML}
            </div>
            <div class="url">
              <p>URL: http://${menu.subdomain}.menuthenu.com</p>
            </div>
            <div class="instructions">
              <p>Scan this QR code to view our digital menu</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Get menu URL for QR code
  const getMenuUrl = () => {
    if (!menu || !menu.subdomain) return '';
    return `http://${menu.subdomain}.menuthenu.com`;
  };

  // QR Code Modal
  const QRCodeModal = () => {
    if (!showQRCode) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Menu Published!</h3>
            <button 
              onClick={() => setShowQRCode(false)}
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
              href={getMenuUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {getMenuUrl()}
            </a>
          </div>
          
          <div className="flex justify-center my-6" ref={qrCodeRef}>
            <QRCode 
              value={getMenuUrl()} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              Share this QR code with your customers to provide easy access to your digital menu
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handlePrintQRCode}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Print QR Code
            </button>
            <button
              onClick={() => setShowQRCode(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-8">
        Error: {error}
      </div>
    );
  }

  if (!menu) {
    return <div className="text-center py-8">Menu not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{menu.name}</h1>
      
      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={handlePrintMenu}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print Menu
        </button>
        <button
          onClick={handleSubmitAndPublish}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Submit and Publish
        </button>
      </div>
      
      {/* Publishing Options */}
      <SubdomainManager menu={menu} onUpdate={handleMenuUpdate} />
      
      {/* Menu Preview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Menu Preview</h2>
        <div className="mb-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Template: {menu.template || 'Default'}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {menu.description || 'No description provided'}
            </p>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium mb-2">Menu Items ({items.length})</h4>
              
              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item._id} className="p-3 bg-white rounded border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.name}</h5>
                          {item.description && (
                            <p className="text-sm text-gray-500">{item.description}</p>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No items in this menu</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden iframe for printing */}
      <iframe 
        ref={printFrameRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />
      
      {/* QR Code Modal */}
      <QRCodeModal />
    </div>
  );
};

export default MenuDetails;
