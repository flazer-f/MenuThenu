// pages/MenuCreator.jsx
import React,{ useState } from 'react';
import TemplateSelection from './TemplateSelection';
import MenuUpload from './MenuUpload';
import MenuPreview from './MenuPreview';

const MenuCreator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [menuFile, setMenuFile] = useState(null);
  const [menuData, setMenuData] = useState({
    name: '',
    items: [
      // Sample data - in real app this would come from file processing
      { name: 'Sample Item 1', price: '9.99', description: 'Delicious sample item' },
      { name: 'Sample Item 2', price: '12.50', description: 'Another tasty option' }
    ]
  });
  
  const [designOptions, setDesignOptions] = useState({
    font: 'sans-serif',
    color: {
      background: '#ffffff',
      text: '#000000',
      accent: '#3b82f6',
      secondaryText: '#666666'
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuFile(file);
      // Process file and update menuData
      // This would be where you extract items from Excel/CSV/image
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Apply template's default colors
    if (template.defaultColors) {
      setDesignOptions(prev => ({
        ...prev,
        color: template.defaultColors
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Menu</h1>
      
      <TemplateSelection 
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleTemplateSelect}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <MenuUpload 
          menuFile={menuFile}
          menuName={menuData.name}
          onFileUpload={handleFileUpload}
          onNameChange={(e) => setMenuData({...menuData, name: e.target.value})}
        />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
              <div>
                <label className="block text-xs text-gray-500 mb-1">Background</label>
                <input 
                  type="color" 
                  value={designOptions.color.background}
                  onChange={(e) => setDesignOptions({
                    ...designOptions,
                    color: {...designOptions.color, background: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text</label>
                <input 
                  type="color" 
                  value={designOptions.color.text}
                  onChange={(e) => setDesignOptions({
                    ...designOptions,
                    color: {...designOptions.color, text: e.target.value}
                  })}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Accent</label>
                <input 
                  type="color" 
                  value={designOptions.color.accent}
                  onChange={(e) => setDesignOptions({
                    ...designOptions,
                    color: {...designOptions.color, accent: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <MenuPreview 
        selectedTemplate={selectedTemplate}
        menuData={menuData}
        designOptions={designOptions}
      />
    </div>
  );
};

export default MenuCreator;