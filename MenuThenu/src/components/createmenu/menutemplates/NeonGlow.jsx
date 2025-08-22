import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const NeonGlow = ({ menuName, items, font, color, backgroundImage }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Group items by category
  const categories = {};
  items?.forEach(item => {
    const category = item.category || 'Neon Delights';
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

  // Default neon colors if none provided
  const defaultColors = {
    background: '#0D0D0D', // Almost black
    text: '#FFFFFF',
    accent: '#FF00FF', // Magenta
    secondaryText: '#00FFFF' // Cyan
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

  // Define the neon text shadow effect
  const neonTextShadow = (color) => {
    return `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
  };

  return (
    <div 
      className={`p-8 font-${font} min-h-screen relative overflow-hidden`}
      style={{ 
        backgroundColor: themeColor.background,
        color: themeColor.text,
      }}
    >
      {/* Background image layer */}
      {backgroundImage?.url && backgroundImage.display !== 'none' && (
        <div 
          className="absolute inset-0 z-0"
          style={bgImageStyle}
        ></div>
      )}
      
      {/* Neon grid background effect */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(${themeColor.accent}22 1px, transparent 1px), linear-gradient(90deg, ${themeColor.accent}22 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      ></div>
      
      {/* Content layer */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Menu Header with neon effect */}
        <div className="text-center mb-16">
          <h1 
            className="text-5xl font-bold tracking-widest mb-2 uppercase"
            style={{ 
              color: themeColor.accent,
              textShadow: neonTextShadow(themeColor.accent),
            }}
          >
            {menuName || 'Neon Menu'}
          </h1>
          <div 
            className="h-0.5 w-48 mx-auto"
            style={{ 
              backgroundColor: themeColor.secondaryText,
              boxShadow: neonTextShadow(themeColor.secondaryText)
            }}
          ></div>
        </div>
        
        {/* Categories */}
        {Object.entries(categories).map(([category, categoryItems], categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            {/* Category header with neon styling */}
            <h2 
              className="text-2xl font-bold text-center mb-8 pb-2 uppercase tracking-widest"
              style={{ 
                color: themeColor.secondaryText,
                textShadow: neonTextShadow(themeColor.secondaryText),
                borderBottom: `1px solid ${themeColor.secondaryText}`
              }}
            >
              {category}
            </h2>
            
            {/* Menu items with neon-outlined cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoryItems.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 relative group"
                >
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      boxShadow: `0 0 10px ${themeColor.accent}, 0 0 20px ${themeColor.accent}`,
                    }}
                  ></div>
                  
                  <div 
                    className="p-6 rounded-lg relative overflow-hidden"
                    style={{ 
                      background: 'rgba(0,0,0,0.8)',
                      border: `1px solid ${themeColor.accent}`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Image or placeholder */}
                      {item.image && (
                        <div className="flex-shrink-0">
                          <div 
                            className="w-16 h-16 rounded-full overflow-hidden border-2"
                            style={{ 
                              borderColor: themeColor.accent,
                              boxShadow: `0 0 10px ${themeColor.accent}`
                            }}
                          >
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 
                            className="text-xl font-semibold"
                            style={{ color: themeColor.text }}
                          >
                            {item.name}
                            {item.isVegetarian && (
                              <span 
                                className="ml-2 text-xs inline-flex items-center justify-center w-4 h-4 rounded-full"
                                style={{ 
                                  backgroundColor: '#4CAF50',
                                  boxShadow: `0 0 5px #4CAF50`
                                }}
                              >
                                V
                              </span>
                            )}
                          </h3>
                          <span 
                            className="text-xl font-bold"
                            style={{ 
                              color: themeColor.accent,
                              textShadow: neonTextShadow(themeColor.accent + '80')
                            }}
                          >
                            ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                          </span>
                        </div>
                        
                        {item.description && (
                          <p 
                            className="mt-1 text-sm line-clamp-2"
                            style={{ color: themeColor.text + 'cc' }}
                          >
                            {item.description}
                          </p>
                        )}
                        
                        {/* Interactive indicator - shows on hover */}
                        <div 
                          className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity inline-block px-3 py-1 rounded"
                          style={{ 
                            backgroundColor: themeColor.secondaryText + '20',
                            color: themeColor.secondaryText,
                            textShadow: neonTextShadow(themeColor.secondaryText + '60')
                          }}
                        >
                          VIEW DETAILS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Footer with neon effect */}
        <div className="text-center mt-16">
          <div 
            className="h-0.5 w-32 mx-auto mb-4"
            style={{ 
              backgroundColor: themeColor.accent,
              boxShadow: neonTextShadow(themeColor.accent)
            }}
          ></div>
          <p 
            className="text-sm"
            style={{ color: themeColor.text + 'cc' }}
          >
            All prices include taxes • Menu items may contain allergens
          </p>
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

export default NeonGlow;
