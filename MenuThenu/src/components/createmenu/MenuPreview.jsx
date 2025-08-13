import React,{ useState } from 'react';

/// components/MenuPreview.jsx
import TemplateManager from './TemplateManager';

const MenuPreview = ({ 
  selectedTemplate,
  menuData,
  designOptions
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {selectedTemplate ? (
          <div className="flex flex-col items-center">
            <div className="w-full overflow-auto border border-gray-200 rounded-lg">
              <TemplateManager 
                selectedTemplateName={selectedTemplate.name}
                menuData={menuData}
                designOptions={designOptions}
              />
            </div>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save & Download Menu
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">Select a template to see preview</p>
        )}
      </div>
    </div>
  );
};

export default MenuPreview;