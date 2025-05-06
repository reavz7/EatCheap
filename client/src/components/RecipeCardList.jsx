"use client"
import { getRecipeIngredients } from "../services/api";
import { FaLeaf, FaCarrot, FaImage } from "react-icons/fa"
import { GiWheat } from "react-icons/gi"
import { IoTimeOutline } from "react-icons/io5"
import RecipeDetails from "./RecipeDetails"

const RecipeCardList = ({
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  ingredients,
  setIngredients,
  loadingIngredients,
  setLoadingIngredients,
}) => {
  const handleCardClick = async (recipeId) => {
    if (selectedRecipe === recipeId) {
      setSelectedRecipe(null)
    } else {
      setSelectedRecipe(recipeId)
      if (!ingredients[recipeId]) {
        try {
          setLoadingIngredients((prev) => ({ ...prev, [recipeId]: true }))
          const ingredientsData = await getRecipeIngredients(recipeId)
          setIngredients((prev) => ({ ...prev, [recipeId]: ingredientsData }))
        } catch (err) {
          console.error("Error fetching ingredients:", err)
        } finally {
          setLoadingIngredients((prev) => ({ ...prev, [recipeId]: false }))
        }
      }
    }
  }

  return (
    <>
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="cursor-pointer" onClick={() => handleCardClick(recipe.id)}>
            <div className="flex items-center p-4">
              <div className="h-16 w-16 relative rounded-lg overflow-hidden mr-4 flex-shrink-0">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl || "/placeholder.svg"}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/64x64?text=No+Image"
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <FaImage className="text-gray-400 text-xl" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    {recipe.isVegan && (
                      <span title="Vegan" className="text-green-500">
                        <FaLeaf />
                      </span>
                    )}
                    {recipe.isVegetarian && (
                      <span title="Vegetarian" className="text-orange-500">
                        <FaCarrot />
                      </span>
                    )}
                    {recipe.isGlutenFree && (
                      <span title="Gluten Free" className="text-yellow-500">
                        <GiWheat />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <IoTimeOutline className="mr-1" />
                    {recipe.averagePreparationTime} min
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedRecipe === recipe.id && (
            <div className="p-4 bg-gray-50 border-t">
              <RecipeDetails
                recipe={recipe}
                ingredients={ingredients[recipe.id]}
                loadingIngredients={loadingIngredients[recipe.id]}
                isMobile={true}
              />
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export default RecipeCardList
