// components/TemplateManager.jsx
import React,{ useState } from 'react';
import ClassicDiner from './menutemplates/ClassicDiner';
import ModernBistro from './menutemplates/ModernBistro';
// import CozyCafe from './templates/CozyCafe';
// import FamilyRestaurant from './templates/FamilyRestaurant';

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
  // Add similar entries for CozyCafe and FamilyRestaurant
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
    />
  );
};

export default TemplateManager;