"use client"

import React from "react"
import { getAllRecipes, getRecipeIngredients } from "../services/api"
import { useState, useEffect, useMemo } from "react"
import Navbar from "../components/Navbar"
import FilterBar from "../components/FilterBar"
import { FaLeaf, FaCarrot, FaImage } from "react-icons/fa"
import { GiWheat, GiCookingPot } from "react-icons/gi"
import { IoTimeOutline } from "react-icons/io5"
import { MdOutlineKitchen } from "react-icons/md"

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [ingredients, setIngredients] = useState({})
  const [loadingIngredients, setLoadingIngredients] = useState({})
  const [filters, setFilters] = useState({
    searchTerm: "",
    maxPrepTime: 180,
    isVegan: false,
    isVegetarian: false,
    isGlutenFree: false,
  })

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes()
        setRecipes(data)
        setFilteredRecipes(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  useMemo(() => {
    const filtered = recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      const matchesPrepTime = recipe.averagePreparationTime <= filters.maxPrepTime
      const matchesVegan = !filters.isVegan || recipe.isVegan
      const matchesVegetarian = !filters.isVegetarian || recipe.isVegetarian
      const matchesGlutenFree = !filters.isGlutenFree || recipe.isGlutenFree

      return matchesSearch && matchesPrepTime && matchesVegan && matchesVegetarian && matchesGlutenFree
    })

    setFilteredRecipes(filtered)
  }, [recipes, filters])

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <FilterBar onFilterChange={handleFilterChange} />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dietary Info
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <IoTimeOutline className="inline mr-1" />
                  Prep Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecipes.map((recipe) => (
                <React.Fragment key={recipe.id}>
                  <tr
                    onClick={() => handleRowClick(recipe.id)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 relative rounded-lg overflow-hidden">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{recipe.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{recipe.description}</div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recipe.averagePreparationTime} min</div>
                    </td>
                  </tr>
                  {selectedRecipe === recipe.id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="text-sm text-gray-700">
                          <div className="flex flex-col md:flex-row gap-6 mb-4">
                            <div className="md:w-1/3">
                              {recipe.imageUrl && (
                                <img
                                  src={recipe.imageUrl || "/placeholder.svg"}
                                  alt={recipe.name}
                                  className="w-full h-48 object-cover rounded-lg shadow-md mb-4"
                                  onError={(e) => {
                                    e.target.src = "https://placehold.co/192x192?text=No+Image"
                                  }}
                                />
                              )}
                              <div className="bg-white p-4 rounded-lg shadow-md">
                                <h4 className="font-medium text-lg mb-3 flex items-center gap-2">
                                  <MdOutlineKitchen className="text-green-500" />
                                  Ingredients
                                </h4>
                                {loadingIngredients[recipe.id] ? (
                                  <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                                  </div>
                                ) : ingredients[recipe.id] ? (
                                  <ul className="space-y-2">
                                    {ingredients[recipe.id].map((ing) => (
                                      <li key={ing.id} className="flex items-center justify-between">
                                        <span>{ing.ingredient.name}</span>
                                        <span className="text-gray-600">
                                          {ing.quantity} {ing.unit}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500">No ingredients available</p>
                                )}
                              </div>
                            </div>
                            <div className="md:w-2/3">
                              <h3 className="font-medium text-lg mb-2">Instructions</h3>
                              <p className="whitespace-pre-line">{recipe.instructions}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Recipes

