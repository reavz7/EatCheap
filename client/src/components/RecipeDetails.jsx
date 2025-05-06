import { MdOutlineKitchen } from "react-icons/md"
import RecipePDFGenerator from "./RecipePDFGenerator"

const RecipeDetails = ({ recipe, ingredients, loadingIngredients, isMobile = false }) => {
  // Prepare data for PDF generation
  const getRecipeForPDF = () => {
    if (!recipe) return null

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      description: recipe.description,
      averagePreparationTime: recipe.averagePreparationTime,
      instructions: recipe.instructions,
      isVegan: recipe.isVegan,
      isVegetarian: recipe.isVegetarian,
      isGlutenFree: recipe.isGlutenFree,
      imageUrl: recipe.imageUrl,
    }
  }

  return (
    <div className="text-sm text-gray-700">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="font-bold text-xl mb-2 sm:mb-0">{recipe.name}</h3>
        <div>
          {!loadingIngredients && ingredients && (
            <RecipePDFGenerator recipe={getRecipeForPDF()} ingredients={ingredients} />
          )}
        </div>
      </div>

      {isMobile ? (
        <MobileRecipeDetails recipe={recipe} ingredients={ingredients} loadingIngredients={loadingIngredients} />
      ) : (
        <DesktopRecipeDetails recipe={recipe} ingredients={ingredients} loadingIngredients={loadingIngredients} />
      )}
    </div>
  )
}

const MobileRecipeDetails = ({ recipe, ingredients, loadingIngredients }) => (
  <div className="flex flex-col gap-6 mb-4">
    <div>
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
      <IngredientsSection ingredients={ingredients} loadingIngredients={loadingIngredients} />
    </div>
    <div>
      <h3 className="font-medium text-lg mb-2">Instrukcje</h3>
      <p className="whitespace-pre-line">{recipe.instructions}</p>
    </div>
  </div>
)

const DesktopRecipeDetails = ({ recipe, ingredients, loadingIngredients }) => (
  <div className="flex flex-col lg:flex-row gap-6 mb-4">
    <div className="lg:w-1/3">
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
      <IngredientsSection ingredients={ingredients} loadingIngredients={loadingIngredients} />
    </div>
    <div className="lg:w-2/3">
      <h3 className="font-medium text-lg mb-2">Instrukcje</h3>
      <p className="whitespace-pre-line">{recipe.instructions}</p>
    </div>
  </div>
)

const IngredientsSection = ({ ingredients, loadingIngredients }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h4 className="font-medium text-lg mb-3 flex items-center gap-2">
      <MdOutlineKitchen className="text-green-500" />
      Składniki
    </h4>
    {loadingIngredients ? (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
      </div>
    ) : ingredients ? (
      <ul className="space-y-2">
        {ingredients.map((ing) => (
          <li key={ing.id} className="flex items-center justify-between">
            <span>{ing.ingredient.name}</span>
            <span className="text-gray-600">
              {ing.quantity} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">Z jakiegoś powodu, ten przepis nie posiada składników 🙅‍♂️</p>
    )}
  </div>
)

export default RecipeDetails
