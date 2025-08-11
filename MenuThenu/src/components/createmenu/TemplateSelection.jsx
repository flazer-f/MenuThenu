import React from "react";

const templates = [
  { id: 1, name: "Classic Diner", desc: "A timeless design for traditional eateries.", img: "/classic.jpg" },
  { id: 2, name: "Modern Bistro", desc: "Sleek and contemporary for upscale dining.", img: "/bistro.jpg" },
  { id: 3, name: "Cozy Cafe", desc: "Warm and inviting for coffee shops and cafes.", img: "/cafe.jpg" },
  { id: 4, name: "Family Restaurant", desc: "Fun and colorful for family-friendly restaurants.", img: "/family.jpg" },
];

export default function TemplateSelection({ selectedTemplate, setSelectedTemplate }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Template Selection</h2>
      {templates.map(t => (
        <div key={t.id} className={`p-2 border rounded-lg mb-3 ${selectedTemplate?.id === t.id ? "border-blue-500" : "border-gray-300"}`}>
          <img src={t.img} alt={t.name} className="w-full h-24 object-cover rounded" />
          <h3 className="mt-2 font-bold">{t.name}</h3>
          <p className="text-sm text-gray-500">{t.desc}</p>
          <button
            onClick={() => setSelectedTemplate(t)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Select
          </button>
        </div>
      ))}
    </div>
  );
}
