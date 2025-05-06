"use client"

import { useState, useEffect, useRef } from "react"
import { makeRecipe, getRecipeIngredients } from "../services/api"
import RecipePDFGenerator from "./RecipePDFGenerator"

const RecipeCard = ({ recipe }) => {
  const [showInstructions, setShowInstructions] = useState(false)
  const [ingredients, setIngredients] = useState([])
  const printRef = useRef(null)

  const handleMakeRecipe = async () => {
    try {
      const response = await makeRecipe(recipe.recipeId)
      alert(response.message)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  const fetchIngredients = async () => {
    try {
      const data = await getRecipeIngredients(recipe.recipeId)
      setIngredients(data)
    } catch (err) {
      console.error("Failed to fetch ingredients:", err)
    }
  }

  useEffect(() => {
    if (showInstructions) {
      fetchIngredients()
    }
  }, [showInstructions, recipe.recipeId])

  return (
    <>
      <div className="bg-white flex flex-col h-[420px] rounded-xl shadow-lg overflow-hidden transform transition duration-300">
        <div className="w-full h-48 overflow-hidden">
          <img
            src={recipe.imageUrl || "/placeholder.svg"}
            alt={recipe.recipeName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-black mb-2 line-clamp-1">{recipe.recipeName}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
          <div className="mb-4">
            <p className="text-sm text-gray-500 flex items-center">
              Czas przygotowania: {recipe.averagePreparationTime} min
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {recipe.isVegan && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Wegańskie
                </span>
              )}
              {recipe.isVegetarian && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Wegetariańskie
                </span>
              )}
              {recipe.isGlutenFree && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Bez glutenu
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <button
              onClick={handleMakeRecipe}
              className="py-2 px-4 w-full bg-[#ff6d00] text-white rounded-md hover:bg-[#e06200] transition duration-300 font-semibold cursor-pointer"
            >
              Zrobiłem!
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 font-semibold cursor-pointer"
            >
              Przepis
            </button>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            ref={printRef}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-black">{recipe.recipeName}</h2>
              <div className="flex items-center space-x-2">
                {/* Przycisk do pobierania PDF */}
                <RecipePDFGenerator recipe={recipe} ingredients={ingredients} />
                <button
                  onClick={() => setShowInstructions(false)}
                  className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center shadow-sm text-s cursor-pointer"
                >
                  Zamknij
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {/* Składniki */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-3">Składniki</h3>
                <ul className="space-y-2">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700 text-sm">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      <span className="font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      <span className="ml-1">{item.ingredient.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Instrukcje</h3>
                <div className="space-y-3">
                  {recipe.instructions.split("\n").map((instruction, index) => (
                    <div key={index} className="text-sm text-gray-700 pl-2 border-l-2 border-gray-200">
                      {instruction}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RecipeCard