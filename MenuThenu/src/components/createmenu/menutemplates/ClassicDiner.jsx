import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const ClassicDiner = ({ menuName, items, font, color }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`p-8 font-${font}`} style={{ backgroundColor: color?.background || '#f5f5f5' }}>
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: color?.text || '#333' }}>
        {menuName || 'Menu'}
      </h1>
      <div className="max-w-2xl mx-auto">
        {items?.map((item, index) => (
          <div 
            key={index} 
            className="mb-6 border-b pb-4 last:border-b-0 hover:bg-white p-3 -mx-3 rounded-md transition-colors cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold" style={{ color: color?.text || '#333' }}>
                {item.name}
                {item.isVegetarian && (
                  <span className="ml-2 text-xs" style={{ color: 'green' }}>●</span>
                )}
              </h3>
              <span className="text-lg font-medium" style={{ color: color?.accent || '#8b5a2b' }}>
                ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-600 mt-1 line-clamp-2" style={{ color: color?.secondaryText || '#666' }}>
                {item.description}
              </p>
            )}
            {/* Clickable indicator */}
            <div 
              className="mt-2 text-xs inline-block opacity-0 hover:opacity-100 transition-opacity px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${color?.accent || '#8b5a2b'}20`,
                color: color?.accent || '#8b5a2b'
              }}
            >
              Click for details
            </div>
          </div>
        ))}
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={color?.accent || '#8b5a2b'}
        />
      )}
    </div>
  );
};

export default ClassicDiner;