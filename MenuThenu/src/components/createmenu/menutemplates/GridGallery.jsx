import React, { useState } from 'react';
import ItemPopup from '../../common/ItemPopup';

const GridGallery = ({ menuName, items, font, color }) => {
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
      className={`p-6 font-${font}`}
      style={{ backgroundColor: color?.background || '#f8f9fa' }}
    >
      {/* Menu Header */}
      <div className="text-center mb-8">
        <h1 
          className="text-3xl font-bold"
          style={{ color: color?.text || '#212529' }}
        >
          {menuName || 'Our Menu'}
        </h1>
        <p 
          className="text-sm mt-2"
          style={{ color: color?.secondaryText || '#6c757d' }}
        >
          Modern and Fresh
        </p>
      </div>
      
      {/* Categories */}
      {Object.entries(categories).map(([category, categoryItems], index) => (
        <div key={index} className="mb-10">
          <h2 
            className="text-xl font-semibold mb-4 text-center pb-2 border-b-2"
            style={{ 
              color: color?.accent || '#007bff',
              borderColor: color?.accent || '#007bff'
            }}
          >
            {category}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems.map((item, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden group"
                style={{ backgroundColor: color?.background === '#f8f9fa' ? 'white' : '#ffffff15' }}
                onClick={() => handleItemClick(item)}
              >
                {/* Use actual image if available */}
                <div 
                  className="h-32 bg-cover bg-center rounded-md mb-3 transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundImage: item.image ? `url(${item.image})` : `linear-gradient(135deg, ${color?.accent || '#007bff'}25, ${color?.accent || '#007bff'}10)`,
                    backgroundColor: `${color?.accent || '#007bff'}25`
                  }}
                ></div>
                
                <div className="flex justify-between items-start mb-1">
                  <h3 
                    className="text-base font-medium"
                    style={{ color: color?.text || '#212529' }}
                  >
                    {item.name}
                    {item.isVegetarian && (
                      <span 
                        className="ml-1 text-xs"
                        style={{ color: 'green' }}
                      >
                        ●
                      </span>
                    )}
                  </h3>
                  <span 
                    className="text-base font-bold"
                    style={{ color: color?.accent || '#007bff' }}
                  >
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                </div>
                
                {item.description && (
                  <p 
                    className="text-xs mt-1 line-clamp-2"
                    style={{ color: color?.secondaryText || '#6c757d' }}
                  >
                    {item.description}
                  </p>
                )}

                {/* Interactive hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity flex items-end justify-center p-3">
                  <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-opacity-70 bg-black transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    View Nutrition
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div 
        className="text-center text-xs mt-8 pt-2 border-t"
        style={{ 
          color: color?.secondaryText || '#6c757d',
          borderColor: `${color?.accent || '#007bff'}25`
        }}
      >
        <p>All prices are subject to applicable taxes</p>
        {items?.some(item => item.isVegetarian) && (
          <p className="mt-1">● Vegetarian</p>
        )}
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <ItemPopup 
          item={selectedItem} 
          onClose={closePopup} 
          accentColor={color?.accent || '#007bff'}
        />
      )}
    </div>
  );
};

export default GridGallery;
