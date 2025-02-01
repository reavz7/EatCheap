import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import RecipeCard from "../components/RecipeCard"
import FilterBar from "../components/FilterBar"
import { getRecipes } from "../services/api"

const Suggestions = () => {
  const [recipes, setRecipes] = useState([])
  const [error, setError] = useState(null)

  const handleFilterChange = async (filters) => {
    try {
      const data = await getRecipes(filters)
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const filters = {}
        const data = await getRecipes(filters)
        setRecipes(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && <p className="text-red-600 text-center mb-8 bg-red-100 p-4 rounded-lg">{error}</p>}

        <FilterBar onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.recipeId} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Suggestions

