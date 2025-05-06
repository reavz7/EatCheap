"use client"

import React from "react"
import { getRecipeIngredients } from "../services/api";
import { FaLeaf, FaCarrot, FaImage } from "react-icons/fa"
import { GiWheat } from "react-icons/gi"
import { IoTimeOutline } from "react-icons/io5"
import RecipeDetails from "./RecipeDetails"

const RecipeTable = ({
  recipes,
  selectedRecipe,
  setSelectedRecipe,
  ingredients,
  setIngredients,
  loadingIngredients,
  setLoadingIngredients,
}) => {
  const handleRowClick = async (recipeId) => {
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
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zdjęcie</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nazwa</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opis</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dieta</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <IoTimeOutline className="inline mr-1" />
            Czas przygotowania
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {recipes.map((recipe) => (
          <React.Fragment key={recipe.id}>
            <tr onClick={() => handleRowClick(recipe.id)} className="hover:bg-gray-50 cursor-pointer transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <RecipeImage imageUrl={recipe.imageUrl} name={recipe.name} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{recipe.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 line-clamp-2">{recipe.description}</div>
              </td>
              <td className="px-6 py-4">
                <DietaryIcons recipe={recipe} />
              </td>
              <td className="px-6 py-4 text-center whitespace-nowrap">
                <div className="text-sm text-gray-900">{recipe.averagePreparationTime} min</div>
              </td>
            </tr>
            {selectedRecipe === recipe.id && (
              <tr>
                <td colSpan="5" className="px-6 py-4 bg-gray-50">
                  <RecipeDetails
                    recipe={recipe}
                    ingredients={ingredients[recipe.id]}
                    loadingIngredients={loadingIngredients[recipe.id]}
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

// Helper component for recipe image
const RecipeImage = ({ imageUrl, name }) => (
  <div className="h-16 w-16 relative rounded-lg overflow-hidden">
    {imageUrl ? (
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={name}
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
)

// Helper component for dietary icons
const DietaryIcons = ({ recipe }) => (
  <div className="flex justify-center space-x-2">
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
)

export default RecipeTable
