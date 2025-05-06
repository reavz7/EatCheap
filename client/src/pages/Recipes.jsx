"use client"

import React from "react"
import { getAllRecipes } from "../services/api"
import { useState, useEffect, useMemo } from "react"
import Navbar from "../components/Navbar"
import FilterBar from "../components/FilterBar"
import RecipeTable from "../components/RecipeTable"
import RecipeCardList from "../components/RecipeCardList"
import ErrorDisplay from "../components/ErrorDisplay"

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
        <ErrorDisplay message={error} />
      </div>
    )
  }

  // Shared props for both desktop and mobile views
  const recipeViewProps = {
    recipes: filteredRecipes,
    selectedRecipe,
    setSelectedRecipe,
    ingredients,
    setIngredients,
    loadingIngredients,
    setLoadingIngredients,
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <FilterBar onFilterChange={handleFilterChange} />

        {/* Desktop table view (hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <RecipeTable {...recipeViewProps} />
        </div>

        {/* Mobile card view (visible only on small screens) */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          <RecipeCardList {...recipeViewProps} />
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nie znaleziono przepisów spełniających kryteria wyszukiwania.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recipes
