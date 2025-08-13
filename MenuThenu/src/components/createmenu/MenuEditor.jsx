import React, { useState } from "react";

export default function MenuEditor({ menuData, setMenuData }) {
  const [activeTab, setActiveTab] = useState("data");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setMenuData({ ...menuData, image: file });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Customize Your Menu</h2>
      <p className="text-sm text-gray-500 mb-4">Upload your menu data and personalize the design.</p>

      <div className="flex border-b mb-4">
        <button onClick={() => setActiveTab("data")} className={`px-4 py-2 ${activeTab === "data" ? "border-b-2 border-black" : ""}`}>
          Data
        </button>
        <button onClick={() => setActiveTab("design")} className={`px-4 py-2 ${activeTab === "design" ? "border-b-2 border-black" : ""}`}>
          Design
        </button>
      </div>

      {activeTab === "data" && (
        <div>
          <label className="block mb-2">Upload Menu Data</label>
          <input type="file" accept=".xlsx,.csv,.jpg,.png" onChange={handleFileUpload} className="mb-4" />

          <label className="block mb-2">Menu Name</label>
          <input
            type="text"
            value={menuData.name}
            onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
            className="border p-2 w-full mb-4"
          />

          <label className="block mb-2">Menu Items</label>
          <textarea
            value={menuData.items.join("\n")}
            onChange={(e) => setMenuData({ ...menuData, items: e.target.value.split("\n") })}
            className="border p-2 w-full h-24"
          />
        </div>
      )}

      {activeTab === "design" && (
        <div>
          <label className="block mb-2">Font</label>
          <select
            value={menuData.font}
            onChange={(e) => setMenuData({ ...menuData, font: e.target.value })}
            className="border p-2 w-full mb-4"
          >
            <option value="">Select Font</option>
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans-serif</option>
          </select>

          <label className="block mb-2">Color Scheme</label>
          <select
            value={menuData.colorScheme}
            onChange={(e) => setMenuData({ ...menuData, colorScheme: e.target.value })}
            className="border p-2 w-full mb-4"
          >
            <option value="">Select Color</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <label className="block mb-2">Layout</label>
          <select
            value={menuData.layout}
            onChange={(e) => setMenuData({ ...menuData, layout: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Select Layout</option>
            <option value="one-column">One Column</option>
            <option value="two-column">Two Column</option>
          </select>
        </div>
      )}
    </div>
  );
}
