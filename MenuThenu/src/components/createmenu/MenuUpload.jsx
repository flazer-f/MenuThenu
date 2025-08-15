import React,{ useState } from 'react';
// components/MenuUpload.jsx


const MenuUpload = ({ 
  menuFile, 
  menuName, 
  onFileUpload, 
  onNameChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-6 bg-blue-600 mr-2"></div>
        <h3 className="font-semibold">Menu Data</h3>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Menu Data</label>
        <div className="flex items-center">
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300">
            Choose File
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls,.csv,.pdf,.jpg,.png"
              onChange={onFileUpload}
            />
          </label>
          {menuFile && (
            <span className="ml-4 text-sm text-gray-600">{menuFile.name}</span>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Name</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={menuName}
          onChange={onNameChange}
          placeholder="Enter menu name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Items</label>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 min-h-32">
          {menuFile ? (
            <p className="text-gray-600">Menu items will be displayed here after processing.</p>
          ) : (
            <p className="text-gray-400">Upload a file to see menu items</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuUpload;