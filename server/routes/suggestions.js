const express = require("express");
const router = express.Router();
const {
  RecipeIngredient,
  Ingredient,
  UserIngredient,
  Recipe,
} = require("../models");
const { convertUnits } = require("../utils/unitConversion"); // Musimy zawsze używać konwersji jednostek
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Używamy userId z tokena
  const { isVegan, isVegetarian, isGlutenFree } = req.query;

  try {
    // Budujemy warunki filtrów na podstawie query stringu
    const filterConditions = {};
    if (isVegan !== undefined)
      filterConditions.isVegan = isVegan === "1" ? 1 : 0;
    if (isVegetarian !== undefined)
      filterConditions.isVegetarian = isVegetarian === "1" ? 1 : 0;
    if (isGlutenFree !== undefined)
      filterConditions.isGlutenFree = isGlutenFree === "1" ? 1 : 0;

    // Pobranie przepisów uwzględniających filtry
    const recipes = await Recipe.findAll({
      where: filterConditions,
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        error: "Nie znaleziono przepisów spełniających podane kryteria",
      });
    }

    // Pobieramy składniki użytkownika
    const userIngredients = await getUserIngredients(userId);

    const possibleRecipes = [];

    // Iteracja po przepisach i sprawdzanie, czy użytkownik ma składniki
    for (const recipe of recipes) {
      const recipeIngredients = await RecipeIngredient.findAll({
        where: { recipe_id: recipe.id },
        include: [
          {
            model: Ingredient,
            as: "ingredient",
            attributes: ["name", "group"], // Pobieramy grupę zamiast jednostki
          },
        ],
      });

      let canMakeRecipe = true; // Flaga, czy użytkownik ma wszystkie składniki

      for (const recipeIngredient of recipeIngredients) {
        const { ingredient_id, quantity, unit } = recipeIngredient;
        const ingredientGroup = recipeIngredient.ingredient.group; // Grupa składnika

        // Zawsze konwertujemy jednostki!
        let requiredQuantity = quantity;
        if (ingredientGroup !== "count") {
          // Jeśli jednostka nie jest sztuką, konwertujemy do gramów (lub innej bazowej jednostki)
          requiredQuantity = convertUnits(quantity, unit, "g"); // Konwersja jednostek do gramów
        }

        // Sprawdzamy, czy użytkownik ma składnik w wymaganej ilości
        const userIngredient = userIngredients[ingredient_id];

        // Użytkownik może mieć składnik w różnych jednostkach, więc konwertujemy również jego składnik
        let userQuantity = userIngredient ? userIngredient.quantity : 0;
        let userUnit = userIngredient ? userIngredient.unit : "";

        if (userUnit && userUnit !== "count") {
          userQuantity = convertUnits(userQuantity, userUnit, "g"); // Konwertujemy do gramów
        }

        if (!userIngredient || userQuantity < requiredQuantity) {
          canMakeRecipe = false;
          break; // Jeśli brakuje składnika, przerywamy
        }
      }

      if (canMakeRecipe) {
        possibleRecipes.push({
          recipeId: recipe.id,
          recipeName: recipe.name,
          message: `Masz wystarczające składniki, aby przygotować ten przepis!`,
        });
      }
    }

    if (possibleRecipes.length === 0) {
      return res.status(404).json({
        error:
          "Brak przepisów, które użytkownik może przygotować z dostępnych składników",
      });
    }

    res.json(possibleRecipes);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania przepisów",
      details: error.message,
    });
  }
});

// Funkcja do pobierania składników użytkownika z bazy
async function getUserIngredients(userId) {
  const userIngredients = await UserIngredient.findAll({
    where: { user_id: userId },
    attributes: ["ingredient_id", "quantity", "unit"],
  });

  // Przechowywanie składników użytkownika w formacie {ingredient_id: {quantity, unit}}
  const userIngredientMap = {};
  userIngredients.forEach(ingredient => {
    userIngredientMap[ingredient.ingredient_id] = {
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    };
  });

  return userIngredientMap;
}

module.exports = router;
