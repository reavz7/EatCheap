import { useState, useEffect } from "react"
import { makeRecipe, getRecipeIngredients } from "../services/api"

const RecipeCard = ({ recipe }) => {
  const [showInstructions, setShowInstructions] = useState(false)
  const [ingredients, setIngredients] = useState([])

  const handleMakeRecipe = async () => {
    try {
      const response = await makeRecipe(recipe.recipeId)
      alert(response.message)
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
  }, [showInstructions, recipe.recipeId]) // Added recipe.recipeId to dependencies

  return (
    <div className="bg-white flex flex-col justify-end h-full rounded-xl shadow-lg overflow-hidden transform transition duration-300 ">
      <img src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.recipeName} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-black mb-2">{recipe.recipeName}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Czas przygotowania: {recipe.averagePreparationTime} min</p>
          <div className="flex space-x-2 mt-2">
            {recipe.isVegan && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Wegańskie</span>
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
        <div className="flex space-x-4">
          <button
            onClick={handleMakeRecipe}
            className="flex-1 py-2 px-4 w-full bg-[#ff6d00] text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer font-semibold"
          >
            Zrobiłem!
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="flex-1 w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer font-semibold"
          >
            Przepis
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-opacity-50 border-[8px] bg-white border-black flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full h-full max-w-4xl max-h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-black mb-4">{recipe.recipeName}</h2>

            <h3 className="text-2xl font-semibold text-black mb-2">Składniki:</h3>
            <ul className="list-disc list-inside mb-6">
              {ingredients.map((item, index) => (
                <li key={index} className="text-gray-700 text-lg">
                  {item.quantity} {item.unit} {item.ingredient.name}
                </li> 
              ))}
            </ul>

            <h3 className="text-2xl font-semibold text-black mb-2">Instrukcje:</h3>
            <div className="space-y-6">
              {recipe.instructions.split("\n").map((instruction, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center mr-4 mt-1">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-lg">{instruction}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="flex justify-center mt-8 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeCard

