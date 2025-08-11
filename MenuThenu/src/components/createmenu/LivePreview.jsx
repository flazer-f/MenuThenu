import React from "react";

export default function LivePreview({ template, menuData }) {
  if (!template) {
    return <p className="text-gray-500">Select a template to preview...</p>;
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">{menuData.name || template.name}</h2>
      {menuData.image && (
        <img
          src={URL.createObjectURL(menuData.image)}
          alt="Uploaded Menu"
          className="mb-4 rounded"
        />
      )}
      <ul className="list-disc pl-5">
        {menuData.items.length > 0 ? (
          menuData.items.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>No items yet...</li>
        )}
      </ul>
    </div>
  );
}
