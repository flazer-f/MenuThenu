import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ItemPopup = ({ item, onClose, accentColor }) => {
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default placeholder image if none provided
  const placeholderImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  
  // Fetch real food data when an item is selected
  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      try {
        // Only make API call if we don't already have the data
        if (!item.ingredients || !item.nutrition) {
          // Get data from our API which fetches from external API
          const response = await fetch(`/api/food-data/${encodeURIComponent(item.name)}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch food data');
          }
          
          const data = await response.json();
          setFoodData(data);
        } else {
          // Use the data that's already in the item
          setFoodData({
            image: item.image,
            ingredients: item.ingredients,
            nutrition: item.nutrition
          });
        }
      } catch (err) {
        console.error('Error fetching food data:', err);
        setError('Failed to load food information');
      } finally {
        setLoading(false);
      }
    };

    if (item) {
      fetchFoodData();
    }
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Item Image (Hero) */}
        <div className="relative h-48 w-full">
          <img 
            src={foodData?.image || item.image || placeholderImage} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white text-2xl font-bold">{item.name}</h2>
            {item.isVegetarian && (
              <span className="inline-block mt-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                Vegetarian
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Price Tag */}
          <div 
            className="absolute right-6 top-44 transform translate-y-3 px-4 py-1 rounded-full shadow-md"
            style={{ 
              backgroundColor: accentColor || '#ff6b6b',
              color: 'white'
            }}
          >
            <span className="text-lg font-bold">
              ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
            </span>
          </div>
          
          {/* Description */}
          {item.description && (
            <div className="mb-6 mt-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
              <p className="text-gray-800">{item.description}</p>
            </div>
          )}
          
          {/* Ingredients */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Ingredients</h4>
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor || '#ff6b6b' }}></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm">
                {error}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside space-y-1">
                  {foodData?.ingredients?.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      {ingredient.name} {ingredient.amount && <span className="text-gray-500 text-sm">{ingredient.amount}</span>}
                    </li>
                  ))}
                </ul>
                
                <div className="text-xs text-gray-500 mt-2 italic">
                  * Ingredient list is indicative. Please check with staff for allergens.
                </div>
              </div>
            )}
          </div>
          
          {/* Nutrition Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Nutritional Information</h4>
            
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accentColor || '#ff6b6b' }}></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm">
                {error}
              </div>
            ) : foodData?.nutrition ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Calories</div>
                  <div className="text-lg font-bold">{foodData.nutrition.calories} kcal</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Protein</div>
                  <div className="text-lg font-bold">{foodData.nutrition.protein}g</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Carbohydrates</div>
                  <div className="text-lg font-bold">{foodData.nutrition.carbs}g</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Fat</div>
                  <div className="text-lg font-bold">{foodData.nutrition.fat}g</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Fiber</div>
                  <div className="text-lg font-bold">{foodData.nutrition.fiber}g</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs text-gray-500">Sugar</div>
                  <div className="text-lg font-bold">{foodData.nutrition.sugar}g</div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 text-sm">
                Nutritional information not available for this item.
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              * Nutritional values are approximate and may vary
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div 
          className="p-4 border-t flex justify-end"
          style={{ borderColor: `${accentColor || '#ff6b6b'}30` }}
        >
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white transition-colors"
            style={{ backgroundColor: accentColor || '#ff6b6b' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ItemPopup.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  accentColor: PropTypes.string
};

export default ItemPopup;
