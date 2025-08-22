import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const FunkyVibes = ({ menuName, items, font, color, backgroundImage }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Group items by category
  const categories = {};
  items?.forEach(item => {
    const category = item.category || 'Funky Eats';
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

  // Default funky colors if none provided
  const defaultColors = {
    background: '#8A2BE2', // Deep purple
    text: '#FFFFFF',
    accent: '#FF1493', // Deep pink
    secondaryText: '#FFA500' // Orange
  };

  // Use provided colors or defaults
  const themeColor = {
    background: color?.background || defaultColors.background,
    text: color?.text || defaultColors.text,
    accent: color?.accent || defaultColors.accent,
    secondaryText: color?.secondaryText || defaultColors.secondaryText
  };

  // Background image styles
  const bgImageStyle = {};
  if (backgroundImage?.url && backgroundImage.display !== 'none') {
    bgImageStyle.backgroundImage = `url(${backgroundImage.url})`;
    bgImageStyle.backgroundSize = backgroundImage.display === 'fullscreen' ? 'cover' : 'repeat';
    bgImageStyle.backgroundRepeat = backgroundImage.display === 'fullscreen' ? 'no-repeat' : 'repeat';
    bgImageStyle.backgroundPosition = 'center';
    bgImageStyle.opacity = backgroundImage.opacity || 1;
  }

  return (
    <div 
      className={`p-8 font-${font} min-h-screen relative`}
      style={{ backgroundColor: themeColor.background }}
    >
      {/* Background image layer */}
      {backgroundImage?.url && backgroundImage.display !== 'none' && (
        <div 
          className="absolute inset-0 z-0"
          style={bgImageStyle}
        ></div>
      )}
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Funky decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full" style={{ 
          background: `radial-gradient(circle, ${themeColor.accent}, transparent)`,
          opacity: 0.6,
          filter: 'blur(20px)'
        }}></div>
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full" style={{ 
          background: `radial-gradient(circle, ${themeColor.secondaryText}, transparent)`,
          opacity: 0.5,
          filter: 'blur(25px)'
        }}></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full" style={{ 
          background: `radial-gradient(circle, ${themeColor.accent}, transparent)`,
          opacity: 0.4,
          filter: 'blur(30px)'
        }}></div>
        
        {/* Menu Header with funky styling */}
        <div className="relative z-10 text-center mb-16 transform -rotate-2">
          <div className="inline-block bg-black bg-opacity-70 px-8 py-3 rounded-lg shadow-lg transform rotate-2">
            <h1 
              className="text-5xl font-extrabold tracking-wider mb-1"
              style={{ 
                color: themeColor.accent,
                textShadow: `2px 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              {menuName || 'Funky Menu'}
            </h1>
            <p
              className="text-lg tracking-widest"
              style={{ color: themeColor.text }}
            >
              TASTE THE VIBE
            </p>
          </div>
        </div>
        
        {/* Categories */}
        <div className="max-w-4xl mx-auto">
          {Object.entries(categories).map(([category, categoryItems], categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              {/* Category header with funky styling */}
              <div className="text-center mb-8 relative">
                <h2 
                  className="text-3xl font-bold inline-block px-10 py-2 transform -rotate-1"
                  style={{ 
                    color: themeColor.text,
                    textShadow: `2px 2px 0px ${themeColor.accent}`,
                    border: `3px solid ${themeColor.accent}`,
                    borderRadius: '100px 0 100px 0',
                    background: 'rgba(0,0,0,0.6)'
                  }}
                >
                  {category}
                </h2>
              </div>
              
              {/* Menu items with funky cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryItems.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1"
                  >
                    <div 
                      className="p-5 rounded-xl shadow-lg relative overflow-hidden"
                      style={{ 
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(5px)',
                        border: `2px solid ${themeColor.accent}`
                      }}
                    >
                      {/* Decorative corner */}
                      <div 
                        className="absolute -top-4 -right-4 w-12 h-12 rounded-full transform rotate-12"
                        style={{ backgroundColor: themeColor.accent }}
                      ></div>
                      
                      <div className="flex items-start gap-4">
                        {/* Image */}
                        <div 
                          className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden border-2"
                          style={{ borderColor: themeColor.accent }}
                        >
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full"
                              style={{ backgroundColor: themeColor.accent }}
                            ></div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 
                              className="text-xl font-bold"
                              style={{ color: themeColor.text }}
                            >
                              {item.name}
                              {item.isVegetarian && (
                                <span 
                                  className="ml-2 text-xs px-2 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: '#4CAF50' }}
                                >
                                  Veg
                                </span>
                              )}
                            </h3>
                            <span 
                              className="text-xl font-extrabold px-2 py-0.5 rounded"
                              style={{ 
                                color: 'black',
                                backgroundColor: themeColor.secondaryText
                              }}
                            >
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </span>
                          </div>
                          
                          {item.description && (
                            <p 
                              className="mt-1 text-sm line-clamp-2"
                              style={{ color: themeColor.text }}
                            >
                              {item.description}
                            </p>
                          )}
                          
                          <div 
                            className="mt-2 text-xs inline-block px-3 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${themeColor.accent}50`,
                              color: themeColor.secondaryText
                            }}
                          >
                            Click for details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div 
          className="text-center mt-12 pt-6"
          style={{ color: themeColor.text }}
        >
          <div 
            className="w-32 h-1 mx-auto mb-4"
            style={{ backgroundColor: themeColor.accent }}
          ></div>
          <p className="text-sm">
            Prices include all applicable taxes
          </p>
          {items?.some(item => item.isVegetarian) && (
            <p className="text-sm mt-1">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: '#4CAF50' }}
              ></span>
              Vegetarian options available
            </p>
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

export default FunkyVibes;
