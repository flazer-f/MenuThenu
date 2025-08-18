import React, { useState } from "react";

const MenuList = () => {
  // Dummy static menu items
  const [menu, setMenu] = useState([
    { _id: "1", name: "Pizza", price: 250 },
    { _id: "2", name: "Burger", price: 150 },
    { _id: "3", name: "Pasta", price: 200 },
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "" });

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setFormData({ name: item.name, price: item.price });
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes (just updates local state for now)
  const handleSave = (id) => {
    setMenu(menu.map((item) => (item._id === id ? { ...item, ...formData } : item)));
    setEditingItem(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
      {menu.map((item) => (
        <div key={item._id} className="bg-white shadow rounded-xl p-4">
          {editingItem === item._id ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-1 mb-2 w-full"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border p-1 mb-2 w-full"
              />
              <button
                onClick={() => handleSave(item._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-500">₹{item.price}</p>
              <button
                onClick={() => handleEditClick(item)}
                className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuList;
