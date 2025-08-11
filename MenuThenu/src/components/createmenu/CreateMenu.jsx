import React, { useState } from "react";
import TemplateSelection from "./TemplateSelection";
import MenuEditor from "./MenuEditor";
import LivePreview from "./LivePreview";

export default function CreateMenu() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [menuData, setMenuData] = useState({
    name: "",
    items: [],
    font: "",
    colorScheme: "",
    layout: "",
    image: null,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Template Selection */}
      <div className="w-1/4 border-r bg-white p-4 overflow-y-auto">
        <TemplateSelection
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-1">
          {/* Form */}
          <div className="w-1/2 border-r p-4 overflow-y-auto">
            <MenuEditor menuData={menuData} setMenuData={setMenuData} />
          </div>
          {/* Preview */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <LivePreview
              template={selectedTemplate}
              menuData={menuData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
