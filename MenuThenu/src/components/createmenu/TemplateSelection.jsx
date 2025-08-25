// components/TemplateSelection.jsx
import React,{ useState } from 'react';

const TemplateSelection = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    {
      id: 1,
      name: 'Classic Diner',
      description: 'A timeless design for traditional restaurants.',
      image: '/templates/classic-diner.png'
    },
    {
      id: 2,
      name: 'Modern Bistro',
      description: 'Sleek and contemporary for upscale dining.',
      image: '/templates/modern-bistro.png'
    },
    {
      id: 3,
      name: 'Minimalist Eatery',
      description: 'Clean, elegant design with emphasis on typography.',
      image: '/templates/minimalist-eatery.png'
    },
    {
      id: 4,
      name: 'Dark Mode Bistro',
      description: 'Sleek dark theme perfect for evening dining and bars.',
      image: '/templates/dark-mode-bistro.png'
    },
    {
      id: 5,
      name: 'Grid Gallery',
      description: 'Modern grid layout with visual emphasis on each dish.',
      image: '/templates/grid-gallery.png'
    },
    {
      id: 6,
      name: 'Card Deck',
      description: 'Playful card-based design for casual restaurants.',
      image: '/templates/card-deck.png'
    },
    {
      id: 7,
      name: 'Funky Vibes',
      description: 'Bold, colorful design with funky elements for a vibrant atmosphere.',
      image: '/templates/funky-vibes.png'
    },
    {
      id: 8,
      name: 'Neon Glow',
      description: 'Glowing neon effect perfect for night venues and modern eateries.',
      image: '/templates/neon-glow.png'
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Template Selection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedTemplate?.id === template.id 
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="h-40 bg-gray-100 mb-4 rounded-md flex items-center justify-center">
              {template.image ? (
                <img src={template.image} alt={template.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-gray-400">Template Preview</span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4 text-sm">{template.description}</p>
            <button 
              className={`px-4 py-2 rounded-md w-full ${
                selectedTemplate?.id === template.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;