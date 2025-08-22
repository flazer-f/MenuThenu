import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const DarkModeBistro = ({ menuName, items, font, color }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Default dark theme colors
  const defaultColors = {
    background: '#121212',
    text: '#ffffff',
    accent: '#bb86fc',
    secondaryText: '#b0b0b0'
  };

  // Use provided colors or defaults
  const themeColor = {
    background: color?.background || defaultColors.background,
    text: color?.text || defaultColors.text,
    accent: color?.accent || defaultColors.accent,
    secondaryText: color?.secondaryText || defaultColors.secondaryText
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div 
      className={`p-8 font-${font} min-h-screen`}
      style={{ backgroundColor: themeColor.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Menu Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-3"
            style={{ color: themeColor.accent }}
          >
            {menuName || 'MENU'}
          </h1>
          <div className="flex justify-center items-center">
            <div 
              className="h-0.5 w-12" 
              style={{ backgroundColor: themeColor.accent }}
            ></div>
            <div 
              className="mx-4 text-sm"
              style={{ color: themeColor.secondaryText }}
            >
              MODERN CUISINE
            </div>
            <div 
              className="h-0.5 w-12" 
              style={{ backgroundColor: themeColor.accent }}
            ></div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {items?.map((item, index) => (
            <div 
              key={index} 
              className="border-b pb-4 relative cursor-pointer hover:shadow-md transition-shadow rounded-lg p-4"
              style={{ 
                borderColor: `${themeColor.accent}30`,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.05)"
              }}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex justify-between">
                <h3 
                  className="text-xl font-medium"
                  style={{ color: themeColor.text }}
                >
                  {item.name}
                  {item.isVegetarian && (
                    <span 
                      className="ml-2 text-xs"
                      style={{ color: '#4caf50' }}
                    >
                      ⬤
                    </span>
                  )}
                </h3>
                <span 
                  className="text-lg font-bold"
                  style={{ color: themeColor.accent }}
                >
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </span>
              </div>
              {item.description && (
                <p 
                  className="mt-1 text-sm line-clamp-2"
                  style={{ color: themeColor.secondaryText }}
                >
                  {item.description}
                </p>
              )}
              {item.category && (
                <div className="mt-2">
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${themeColor.accent}30`,
                      color: themeColor.accent 
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              )}

              {/* Interactive indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-gradient-to-r from-transparent to-transparent hover:from-black hover:to-black hover:bg-opacity-30 transition-all rounded-lg">
                <div 
                  className="px-4 py-2 rounded-full text-sm transform translate-y-2 hover:translate-y-0 transition-transform"
                  style={{ 
                    backgroundColor: themeColor.accent,
                    color: '#ffffff'
                  }}
                >
                  Nutrition Info
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div 
          className="mt-12 text-center text-xs"
          style={{ color: themeColor.secondaryText }}
        >
          <p>Prices are inclusive of taxes</p>
          {items?.some(item => item.isVegetarian) && (
            <p className="mt-1">⬤ Vegetarian Options</p>
          )}
        </div>
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={themeColor.accent}
        />
      )}
    </div>
  );
};

export default DarkModeBistro;
