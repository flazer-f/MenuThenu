import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const MinimalistEatery = ({ menuName, items, font, color }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Group items by category
  const categories = {};
  items?.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div 
      className={`p-8 font-${font} min-h-screen`} 
      style={{ backgroundColor: color?.background || '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Menu Header */}
        <div className="mb-16 text-center">
          <h1 
            className="text-3xl tracking-widest uppercase mb-2 font-light" 
            style={{ color: color?.text || '#222' }}
          >
            {menuName || 'Menu'}
          </h1>
          <div 
            className="h-px w-16 mx-auto" 
            style={{ backgroundColor: color?.accent || '#222' }}
          ></div>
        </div>
        
        {/* Menu Categories */}
        {Object.keys(categories).map((category, index) => (
          <div key={index} className="mb-12">
            <h2 
              className="text-lg uppercase tracking-widest mb-6 text-center font-light"
              style={{ color: color?.accent || '#222' }}
            >
              {category}
            </h2>
            
            <div className="space-y-6">
              {categories[category].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-baseline p-3 -mx-3 rounded-md transition-colors cursor-pointer hover:bg-gray-50"
                  style={{ 
                    '--hover-bg': color?.background === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex-1">
                    <h3 
                      className="text-base font-medium"
                      style={{ color: color?.text || '#222' }}
                    >
                      {item.name}
                      {item.isVegetarian && (
                        <span className="ml-2 text-xs align-top" style={{ color: color?.accent || 'green' }}>●</span>
                      )}
                    </h3>
                    {item.description && (
                      <p 
                        className="text-sm mt-1 line-clamp-1"
                        style={{ color: color?.secondaryText || '#777' }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div 
                    className="text-base font-light ml-4 flex items-center"
                    style={{ color: color?.text || '#222' }}
                  >
                    <span className="mr-2">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center text-xs mt-12" style={{ color: color?.secondaryText || '#777' }}>
          {item => item.isVegetarian && <span>● Vegetarian</span>}
        </div>
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={color?.accent || '#222'}
        />
      )}
    </div>
  );
};

export default MinimalistEatery;
