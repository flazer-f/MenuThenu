import React,{ useState } from 'react';

// components/templates/ModernBistro.jsx
const ModernBistro = ({ menuName, items, font, color }) => {
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
          <div key={index} className="border-b pb-6 last:border-b-0">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium" style={{ color: color?.text || '#222' }}>
                {item.name}
              </h3>
              <span className="text-base" style={{ color: color?.accent || '#555' }}>
                ${item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-sm mt-1" style={{ color: color?.secondaryText || '#777' }}>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModernBistro;