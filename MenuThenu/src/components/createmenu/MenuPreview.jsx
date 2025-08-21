import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import TemplateManager from './TemplateManager';

const MenuPreview = ({ 
  selectedTemplate,
  menuData,
  designOptions
}) => {
  const previewRef = useRef(null);

  const handleDownload = () => {
    if (!previewRef.current) return;
    
    // Create a clean preview by cloning the content and removing buttons
    const previewContent = previewRef.current.cloneNode(true);
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${menuData.name || 'Menu'}</title>
        <style>
          body {
            font-family: ${designOptions.font}, sans-serif;
            margin: 0;
            padding: 0;
          }
          .menu-container {
            background-color: ${designOptions.color.background};
            color: ${designOptions.color.text};
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="menu-container">
          ${previewContent.innerHTML}
        </div>
      </body>
      </html>
    `;
    
    // Create a Blob with the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menuData.name || 'menu'}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to print the menu
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${menuData.name || 'Menu'} - Print Preview</title>
          <style>
            body {
              font-family: ${designOptions.font}, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: ${designOptions.color.background};
              color: ${designOptions.color.text};
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${previewRef.current.innerHTML}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Add slight delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {selectedTemplate ? (
          <div className="flex flex-col items-center">
            <div 
              ref={previewRef}
              className="w-full overflow-auto border border-gray-200 rounded-lg mb-6"
              style={{ 
                backgroundColor: designOptions.color.background,
                color: designOptions.color.text,
                minHeight: '400px' 
              }}
            >
              <TemplateManager 
                selectedTemplateName={selectedTemplate.name}
                menuData={menuData}
                designOptions={designOptions}
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleDownload}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download HTML
              </button>
              <button 
                onClick={handlePrint}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Print Menu
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">Select a template to see preview</p>
        )}
      </div>
    </div>
  );
};

MenuPreview.propTypes = {
  selectedTemplate: PropTypes.object,
  menuData: PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.array
  }).isRequired,
  designOptions: PropTypes.shape({
    font: PropTypes.string,
    color: PropTypes.object
  }).isRequired
};

export default MenuPreview;