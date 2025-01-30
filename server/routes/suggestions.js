const express = require("express");
const router = express.Router();
const {
  RecipeIngredient,
  Ingredient,
  UserIngredient,
  Recipe,
} = require("../models");
const { convertUnits } = require("../utils/unitConversion");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Używamy userId z tokena
  const { isVegan, isVegetarian, isGlutenFree } = req.query;

  try {
    const filterConditions = {};  
    if (isVegan !== undefined)
      filterConditions.isVegan = isVegan === "1" ? 1 : 0;
    if (isVegetarian !== undefined)
      filterConditions.isVegetarian = isVegetarian === "1" ? 1 : 0;
    if (isGlutenFree !== undefined)
      filterConditions.isGlutenFree = isGlutenFree === "1" ? 1 : 0;

    const recipes = await Recipe.findAll({
      where: filterConditions,
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        error: "Nie znaleziono przepisów spełniających podane kryteria",
      });
    }

    const userIngredients = await getUserIngredients(userId);

    const possibleRecipes = [];

    for (const recipe of recipes) {
      const recipeIngredients = await RecipeIngredient.findAll({
        where: { recipe_id: recipe.id },
        include: [
          {
            model: Ingredient,
            as: "ingredient",
            attributes: ["name", "group"],
          },
        ],
      });

      let canMakeRecipe = true;

      for (const recipeIngredient of recipeIngredients) {
        const { ingredient_id, quantity, unit } = recipeIngredient;
        const ingredientGroup = recipeIngredient.ingredient.group;

        let requiredQuantity = quantity;
        if (ingredientGroup !== "count") {
          requiredQuantity = convertUnits(quantity, unit, "g");
        }

        const userIngredient = userIngredients[ingredient_id];

        let userQuantity = userIngredient ? userIngredient.quantity : 0;
        let userUnit = userIngredient ? userIngredient.unit : "";

        if (userUnit && userUnit !== "count") {
          userQuantity = convertUnits(userQuantity, userUnit, "g");
        }

        if (!userIngredient || userQuantity < requiredQuantity) {
          canMakeRecipe = false;
          break;
        }
      }

      if (canMakeRecipe) {
        possibleRecipes.push({
          recipeId: recipe.id,
          recipeName: recipe.name,
          imageUrl: recipe.imageUrl, 
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

// pobieranie składników użytkownika z bazy
async function getUserIngredients(userId) {
  const userIngredients = await UserIngredient.findAll({
    where: { user_id: userId },
    attributes: ["ingredient_id", "quantity", "unit"],
  });

  // tutaj skladniki użytkownika w formacie {ingredient_id: {quantity, unit}}
  const userIngredientMap = {};
  userIngredients.forEach((ingredient) => {
    userIngredientMap[ingredient.ingredient_id] = {
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    };
  });

  return userIngredientMap;
}


router.post("/make-recipe",verifyToken, async (req, res) => {
  const userId = req.userId; // Używamy userId z tokena
  const { recipeId } = req.body; // Przekazujemy recipeId w ciele requestu
 
  try {
    // Pobieramy przepis
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({
        error: "Nie znaleziono przepisu o podanym ID",
      });
    }

    // Pobieramy składniki przepisu
    const recipeIngredients = await RecipeIngredient.findAll({
      where: { recipe_id: recipeId },
      include: [
        {
          model: Ingredient,
          as: "ingredient",
          attributes: ["name", "group"],
        },
      ],
    });

    const userIngredients = await getUserIngredients(userId);

    // Sprawdzamy, czy użytkownik ma wystarczająco składników
    for (const recipeIngredient of recipeIngredients) {
      const { ingredient_id, quantity, unit } = recipeIngredient;
      const ingredientGroup = recipeIngredient.ingredient.group;

      let requiredQuantity = quantity;
      if (ingredientGroup !== "count") {
        requiredQuantity = convertUnits(quantity, unit, "g");
      }

      const userIngredient = userIngredients[ingredient_id];
      let userQuantity = userIngredient ? userIngredient.quantity : 0;
      let userUnit = userIngredient ? userIngredient.unit : "";

      if (userUnit && userUnit !== "count") {
        userQuantity = convertUnits(userQuantity, userUnit, "g");
      }

      if (!userIngredient || userQuantity < requiredQuantity) {
        return res.status(400).json({
          error: "Nie masz wystarczającej ilości składników do przygotowania tego przepisu",
        });
      }
    }

    // Jeśli użytkownik ma wystarczająco składników, odejmujemy je
    for (const recipeIngredient of recipeIngredients) {
      const { ingredient_id, quantity, unit } = recipeIngredient;
      const ingredientGroup = recipeIngredient.ingredient.group;

      let requiredQuantity = quantity;
      if (ingredientGroup !== "count") {
        requiredQuantity = convertUnits(quantity, unit, "g");
      }

      const userIngredient = userIngredients[ingredient_id];
      let userQuantity = userIngredient ? userIngredient.quantity : 0;
      let userUnit = userIngredient ? userIngredient.unit : "";

      if (userUnit && userUnit !== "count") {
        userQuantity = convertUnits(userQuantity, userUnit, "g");
      }

      // Odejmujemy składnik
      const newQuantity = userQuantity - requiredQuantity;

      await UserIngredient.update(
        { quantity: newQuantity },
        { where: { user_id: userId, ingredient_id: ingredient_id } }
      );
    }

    res.json({ message: "Przepis został wykonany, składniki zostały odjęte!" });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas wykonania przepisu",
      details: error.message,
    });
  }
});


module.exports = router;
