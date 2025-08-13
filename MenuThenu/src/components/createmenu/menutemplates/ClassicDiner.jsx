import React,{ useState } from 'react';


// components/templates/ClassicDiner.jsx
const ClassicDiner = ({ menuName, items, font, color }) => {
  return (
    <div className={`p-8 font-${font}`} style={{ backgroundColor: color?.background || '#f5f5f5' }}>
      <h1 className="text-4xl font-bold text-center mb-8" style={{ color: color?.text || '#333' }}>
        {menuName || 'Menu'}
      </h1>
      <div className="max-w-2xl mx-auto">
        {items?.map((item, index) => (
          <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold" style={{ color: color?.text || '#333' }}>
                {item.name}
              </h3>
              <span className="text-lg font-medium" style={{ color: color?.accent || '#8b5a2b' }}>
                ${item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-600 mt-1" style={{ color: color?.secondaryText || '#666' }}>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassicDiner;