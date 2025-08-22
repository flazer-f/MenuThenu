// components/TemplateManager.jsx
import React,{ useState } from 'react';
import ClassicDiner from './menutemplates/ClassicDiner';
import ModernBistro from './menutemplates/ModernBistro';
import MinimalistEatery from './menutemplates/MinimalistEatery';
import DarkModeBistro from './menutemplates/DarkModeBistro';
import GridGallery from './menutemplates/GridGallery';
import CardDeck from './menutemplates/CardDeck';
import FunkyVibes from './menutemplates/FunkyVibes';
import NeonGlow from './menutemplates/NeonGlow';

const templates = {
  'Classic Diner': {
    component: ClassicDiner,
    defaultColors: {
      background: '#f5f5f5',
      text: '#333',
      accent: '#8b5a2b',
      secondaryText: '#666'
    }
  },
  'Modern Bistro': {
    component: ModernBistro,
    defaultColors: {
      background: '#ffffff',
      text: '#222',
      accent: '#000',
      secondaryText: '#777'
    }
  },
  'Minimalist Eatery': {
    component: MinimalistEatery,
    defaultColors: {
      background: '#ffffff',
      text: '#222222',
      accent: '#444444',
      secondaryText: '#666666'
    }
  },
  'Dark Mode Bistro': {
    component: DarkModeBistro,
    defaultColors: {
      background: '#121212',
      text: '#ffffff',
      accent: '#bb86fc',
      secondaryText: '#b0b0b0'
    }
  },
  'Grid Gallery': {
    component: GridGallery,
    defaultColors: {
      background: '#f8f9fa',
      text: '#212529',
      accent: '#007bff',
      secondaryText: '#6c757d'
    }
  },
  'Card Deck': {
    component: CardDeck,
    defaultColors: {
      background: '#ffffff',
      text: '#333333',
      accent: '#ff6b6b',
      secondaryText: '#666666'
    }
  },
  'Funky Vibes': {
    component: FunkyVibes,
    defaultColors: {
      background: '#8A2BE2', // Deep purple
      text: '#FFFFFF',
      accent: '#FF1493', // Deep pink
      secondaryText: '#FFA500' // Orange
    }
  },
  'Neon Glow': {
    component: NeonGlow,
    defaultColors: {
      background: '#0D0D0D', // Almost black
      text: '#FFFFFF',
      accent: '#FF00FF', // Magenta
      secondaryText: '#00FFFF' // Cyan
    }
  }
};

const TemplateManager = ({ 
  selectedTemplateName, 
  menuData, 
  designOptions 
}) => {
  const template = templates[selectedTemplateName];
  
  if (!template) {
    return <div className="p-8 text-center">Please select a template</div>;
  }

  const TemplateComponent = template.component;
  
  return (
    <TemplateComponent 
      menuName={menuData.name}
      items={menuData.items}
      font={designOptions.font}
      color={designOptions.color}
      backgroundImage={designOptions.backgroundImage}
    />
  );
};

export default TemplateManager;