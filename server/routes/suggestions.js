const express = require("express");
const { Op } = require("sequelize"); // dodajemy operator Sequelize
const router = express.Router();
const {
  RecipeIngredient,
  Ingredient,
  UserIngredient,
  Recipe,
} = require("../models");
const { convertUnits } = require("../utils/unitConversion");
const { subtractIngredient } = require("../utils/unitConversion");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Używamy userId z tokena
  const { isVegan, isVegetarian, isGlutenFree, maxPrepTime, searchTerm } = req.query;

  try {
    // Budujemy warunki filtrowania
    const filterConditions = {};

    if (isVegan !== undefined)
      filterConditions.isVegan = isVegan === "1" ? 1 : 0;
    if (isVegetarian !== undefined)
      filterConditions.isVegetarian = isVegetarian === "1" ? 1 : 0;
    if (isGlutenFree !== undefined)
      filterConditions.isGlutenFree = isGlutenFree === "1" ? 1 : 0;
      
    // Filtrowanie wg. czasu przygotowania, jeżeli przekazano parametr
    if (maxPrepTime) {
      // Zakładam, że w bazie masz pole averagePreparationTime
      filterConditions.averagePreparationTime = { [Op.lte]: parseInt(maxPrepTime) };
    }
    
    // Filtrowanie wg. wyszukiwanego tekstu (nazwa przepisu)
    // Filtrowanie wg. wyszukiwanego tekstu (nazwa przepisu)
if (searchTerm) {
  // Używamy Op.like zamiast Op.iLike, bo MySQL nie obsługuje iLike
  filterConditions.name = { [Op.like]: `%${searchTerm}%` };
  // Jeśli chcesz, żeby wyszukiwanie było nieczułe na wielkość liter, 
  // możesz ustawić odpowiednią kolację w MySQL (np. utf8_general_ci)
}


    const recipes = await Recipe.findAll({
      where: filterConditions,
    });

    if (recipes.length === 0) {
      return res.status(404).json({
        error: "Brak przepisów, które użytkownik może przygotować z dostępnych składników lub z wybranymi filtrami",
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
          description: recipe.description,
          instructions: recipe.instructions,
          averagePreparationTime: recipe.averagePreparationTime,
          isVegan: recipe.isVegan,
          isVegetarian: recipe.isVegetarian,
          isGlutenFree: recipe.isGlutenFree,
          message: "Masz wystarczające składniki, aby przygotować ten przepis!",
        });
      }
    }

    if (possibleRecipes.length === 0) {
      return res.status(404).json({
        error: "Brak przepisów, które użytkownik może przygotować z dostępnych składników lub z wybranymi filtrami",
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

async function getUserIngredients(userId) {
  const userIngredients = await UserIngredient.findAll({
    where: { user_id: userId },
    attributes: ["ingredient_id", "quantity", "unit"],
  });

  const userIngredientMap = {};
  userIngredients.forEach((ingredient) => {
    userIngredientMap[ingredient.ingredient_id] = {
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    };
  });

  return userIngredientMap;
}

// Router do obsługi wykonywania przepisu:
router.post("/make-recipe", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { recipeId } = req.body;

  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({
        error: "Nie znaleziono przepisu o podanym ID",
      });
    }

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
        try {
          userQuantity = subtractIngredient(userQuantity, userUnit, requiredQuantity, "g");
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      } else {
        userQuantity -= requiredQuantity;
      }

      if (userQuantity <= 0) {
        await UserIngredient.destroy({
          where: { user_id: userId, ingredient_id: ingredient_id }
        });
      } else {
        await UserIngredient.update(
          { quantity: userQuantity },
          { where: { user_id: userId, ingredient_id: ingredient_id } }
        );
      }
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

