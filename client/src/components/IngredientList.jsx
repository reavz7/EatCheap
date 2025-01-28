import React, { useState } from "react";
import { deleteUserIngredient } from "../services/api";

const IngredientList = ({ 
  userIngredients, 
  ingredientsList, 
  onModify, 
  fetchUserIngredients, 
  showModal 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (ingredientId) => {
    try {
      await deleteUserIngredient(ingredientId);
      showModal("Sukces!", "Składnik został usunięty!");
      await fetchUserIngredients();
    } catch (error) {
      showModal("Mamy problem!", "Wystąpił błąd podczas usuwania składnika.");
    }
  };

  const filteredUserIngredients = userIngredients.filter((ingredient) => {
    const ingredientName = ingredientsList.find(
      (item) => item.id === ingredient.ingredient_id
    )?.name;
    return ingredientName && ingredientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lista twoich składników</h2>
      <input
        type="text"
        placeholder="Szukaj składników"
        className="w-full mb-4 rounded-md border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="h-80 overflow-y-auto">
        <ul className="space-y-2 text-black pr-2">
          {filteredUserIngredients.map((ingredient) => {
            const ingredientName = ingredientsList.find(
              (item) => item.id === ingredient.ingredient_id
            )?.name;
            return (
              <li
                key={ingredient.id}
                className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded hover:bg-gray-100 transition duration-300"
              >
                <span className="text-sm">
                  {ingredientName ? ingredientName : "Nieznany składnik"} - {ingredient.quantity} {ingredient.unit}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onModify(ingredient)}
                    className="bg-[#ff6d00] text-white py-1 px-2 rounded text-sm hover:bg-black transition duration-300 cursor-pointer"
                  >
                    Modyfikuj
                  </button>
                  <button
                    onClick={() => handleDelete(ingredient.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-black transition duration-300 cursor-pointer"
                  >
                    Usuń
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default IngredientList;
