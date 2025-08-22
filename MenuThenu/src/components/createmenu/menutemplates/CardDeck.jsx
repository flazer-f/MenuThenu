import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const CardDeck = ({ menuName, items, font, color }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Group items by category for better organization
  const itemsByCategory = {};
  items?.forEach(item => {
    const category = item.category || 'Main Menu';
    if (!itemsByCategory[category]) {
      itemsByCategory[category] = [];
    }
    itemsByCategory[category].push(item);
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div 
      className={`p-6 font-${font}`}
      style={{ backgroundColor: color?.background || '#ffffff' }}
    >
      {/* Menu Header */}
      <div className="text-center mb-10">
        <h1 
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: color?.accent || '#ff6b6b' }}
        >
          {menuName || 'Our Menu'}
        </h1>
        <div 
          className="h-1 w-24 mx-auto mt-2 rounded-full"
          style={{ backgroundColor: color?.accent || '#ff6b6b' }}
        ></div>
      </div>
      
      {/* Categories */}
      {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => (
        <div key={categoryIndex} className="mb-12">
          <h2 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: color?.text || '#333333' }}
          >
            {category}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {categoryItems.map((item, itemIndex) => (
              <div 
                key={itemIndex}
                className="rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 w-full max-w-xs cursor-pointer"
                style={{ backgroundColor: color?.background === '#ffffff' ? '#f8f9fa' : '#ffffff10' }}
                onClick={() => handleItemClick(item)}
              >
                {/* Card Header/Image Area */}
                <div 
                  className="h-40 flex items-center justify-center p-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${color?.accent || '#ff6b6b'}, ${color?.accent || '#ff6b6b'}80)`,
                    color: '#ffffff'
                  }}
                >
                  <h3 className="text-2xl font-bold text-center">{item.name}</h3>
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  {item.description && (
                    <p 
                      className="text-sm mb-4 line-clamp-2"
                      style={{ color: color?.secondaryText || '#666666' }}
                    >
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {item.isVegetarian && (
                        <span 
                          className="inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: '#4caf50',
                            color: 'white' 
                          }}
                        >
                          V
                        </span>
                      )}
                      {item.category && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${color?.accent || '#ff6b6b'}20`,
                            color: color?.accent || '#ff6b6b'
                          }}
                        >
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div 
                      className="text-xl font-bold"
                      style={{ color: color?.accent || '#ff6b6b' }}
                    >
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                  </div>
                </div>

                {/* Interactive hover indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all opacity-0 hover:opacity-100">
                  <div 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: color?.accent || '#ff6b6b',
                      color: '#ffffff'
                    }}
                  >
                    View Details
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Footer */}
      <div 
        className="mt-10 pt-4 border-t text-center text-sm"
        style={{ 
          borderColor: `${color?.accent || '#ff6b6b'}30`,
          color: color?.secondaryText || '#666666'
        }}
      >
        <p>Prices are subject to change. Allergen information available upon request.</p>
        {items?.some(item => item.isVegetarian) && (
          <p className="mt-2">V - Vegetarian Option</p>
        )}
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={color?.accent || '#ff6b6b'}
        />
      )}
    </div>
  );
};

export default CardDeck;
