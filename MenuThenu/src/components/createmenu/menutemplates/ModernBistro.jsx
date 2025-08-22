import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const ModernBistro = ({ menuName, items, font, color }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`p-6 font-${font}`} style={{ backgroundColor: color?.background || '#ffffff' }}>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light tracking-wider mb-2" style={{ color: color?.text || '#222' }}>
          {menuName || 'OUR MENU'}
        </h1>
        <div className="w-20 h-1 mx-auto" style={{ backgroundColor: color?.accent || '#000' }}></div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {items?.map((item, index) => (
          <div 
            key={index} 
            className="border-b pb-6 last:border-b-0 hover:bg-gray-50 p-3 -mx-3 rounded-md transition-colors cursor-pointer"
            style={{ 
              borderColor: `${color?.accent || '#000'}30`,
              '--hover-bg': color?.background === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'
            }}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium" style={{ color: color?.text || '#222' }}>
                {item.name}
                {item.isVegetarian && (
                  <span className="ml-2 text-xs" style={{ color: 'green' }}>●</span>
                )}
              </h3>
              <span className="text-base" style={{ color: color?.accent || '#555' }}>
                ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-sm mt-1 line-clamp-2" style={{ color: color?.secondaryText || '#777' }}>
                {item.description}
              </p>
            )}
            {/* Interactive indicator */}
            <div className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: color?.accent || '#000' }}>
              Click for nutrition details
            </div>
          </div>
        ))}
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={color?.accent || '#000'}
        />
      )}
    </div>
  );
};

export default ModernBistro;