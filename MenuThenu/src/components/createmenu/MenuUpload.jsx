import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FileUploader from './FileUploader';
import ImageUploader from '../common/ImageUploader';

const MenuUpload = ({ menuData, setMenuData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isVegetarian: false,
    image: ''
  });

  const handleDataExtracted = (extractedItems) => {
    setMenuData({
      ...menuData,
      items: [...extractedItems]
    });
  };

  const handleNameChange = (e) => {
    setMenuData({
      ...menuData,
      name: e.target.value
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      return; // Don't add empty items
    }
    
    setMenuData({
      ...menuData,
      items: [...menuData.items, {
        ...newItem,
        price: parseFloat(newItem.price)
      }]
    });
    
    // Reset form
    setNewItem({
      name: '',
      price: '',
      description: '',
      category: '',
      isVegetarian: false,
      image: ''
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...menuData.items];
    updatedItems.splice(index, 1);
    setMenuData({
      ...menuData,
      items: updatedItems
    });
  };

  const handleEditItem = (index, field, value) => {
    const updatedItems = [...menuData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    setMenuData({
      ...menuData,
      items: updatedItems
    });
  };

  const handleItemImageUpload = (index, imageUrl) => {
    const updatedItems = [...menuData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      image: imageUrl
    };
    setMenuData({
      ...menuData,
      items: updatedItems
    });
  };

  const handleNewItemImageUpload = (imageUrl) => {
    setNewItem({
      ...newItem,
      image: imageUrl
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-6 bg-blue-600 mr-2"></div>
        <h3 className="font-semibold">Menu Data</h3>
      </div>
      
      <FileUploader 
        onDataExtracted={handleDataExtracted}
        setIsLoading={setIsLoading}
      />
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Name</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={menuData.name}
          onChange={handleNameChange}
          placeholder="Enter menu name"
        />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Menu Items</label>
          <span className="text-sm text-gray-500">{menuData.items.length} items</span>
        </div>
        
        {/* Add new item form */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Item</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <ImageUploader
                initialImage={newItem.image}
                onImageUpload={handleNewItemImageUpload}
                className="mb-2"
              />
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex flex-col justify-between">
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category (optional)"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <div className="flex items-center bg-white px-3 py-2 border border-gray-300 rounded-md">
                  <input
                    type="checkbox"
                    id="isVegetarian"
                    checked={newItem.isVegetarian}
                    onChange={e => setNewItem({...newItem, isVegetarian: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isVegetarian" className="text-sm text-gray-700">Vegetarian</label>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddItem}
            disabled={!newItem.name || !newItem.price}
            className={`mt-2 px-4 py-2 text-sm rounded ${
              !newItem.name || !newItem.price
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Add Item
          </button>
        </div>
        
        {/* Items table */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          {menuData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ImageUploader
                          initialImage={item.image}
                          onImageUpload={(url) => handleItemImageUpload(index, url)}
                          className="w-16 h-16"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500">{item.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.category || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              {isLoading ? 'Loading items...' : 'No items yet. Upload a file or add items manually.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MenuUpload.propTypes = {
  menuData: PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.array
  }).isRequired,
  setMenuData: PropTypes.func.isRequired
};

export default MenuUpload;