import { useState } from "react"
import { makeRecipe } from "../services/api"

const RecipeCard = ({ recipe }) => {
  const [showInstructions, setShowInstructions] = useState(false)

  const handleMakeRecipe = async () => {
    try {
      const response = await makeRecipe(recipe.recipeId)
      alert(response.message)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="bg-white flex flex-col justify-end h-full rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.recipeName} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-black mb-2">{recipe.recipeName}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Prep time: {recipe.averagePreparationTime} min</p>
          <div className="flex space-x-2 mt-2">
            {recipe.isVegan && (
              <span className="bg-green-100  text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Wegańskie</span>
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
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-orange-400 rounded-xl p-4 w-full max-w-3xl max-h-[40vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-black mb-4">{recipe.recipeName}</h2>
            <div className="space-y-6">
              {recipe.instructions.split('\n').map((instruction, index) => (
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
              className="mt-8 absolute right-10 lg:top-4 md:top-24 bg-indigo-600 text-white py-2 p-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeCard
