const express = require("express");
const router = express.Router();
const { RecipeIngredient, Ingredient } = require("../models");
const verifyToken = require("../middleware/verifyToken");
const { isValidUnit } = require("../utils/unitAllowed.js");

// 1. Pobranie wszystkich składników dla przepisu
router.get("/:recipeId", verifyToken, async (req, res) => {
  // Dodano verifyToken
  const { recipeId } = req.params;

  try {
    const ingredients = await RecipeIngredient.findAll({
      where: { recipe_id: recipeId },
      include: [
        {
          model: Ingredient,
          as: "ingredient", // Dodano alias, zgodnie z modelem Ingredient
          attributes: ["name", "group"],
        },
      ],
    });

    if (ingredients.length === 0) {
      return res
        .status(404)
        .json({ error: "Brak składników dla tego przepisu" });
    }

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania składników",
      details: error.message,
    });
  }
});

// 2. Dodanie składnika do przepisu
router.post("/", verifyToken, async (req, res) => {
  const { recipe_id, ingredient_id, quantity, unit } = req.body;

  if (!recipe_id || !ingredient_id || !quantity || !unit) {
    return res
      .status(400)
      .json({ error: "Wymagane pola: recipe_id, ingredient_id, quantity, unit" });
  }

  try {
    // Sprawdzanie, czy składnik istnieje
    const ingredient = await Ingredient.findByPk(ingredient_id);
    if (!ingredient) {
      return res.status(404).json({ error: "Składnik nie znaleziony" });
    }

    // Sprawdzanie, czy jednostka pasuje do grupy jednostek składnika
    if (!isValidUnit(unit, ingredient.group)) {
      return res.status(400).json({
        error: `Jednostka "${unit}" nie pasuje do grupy "${ingredient.group}" składnika "${ingredient.name}"`,
      });
    }

    // Dodanie składnika do przepisu
    const newRecipeIngredient = await RecipeIngredient.create({
      recipe_id,
      ingredient_id,
      quantity,
      unit,
    });

    res.status(201).json({
      message: "Składnik dodany do przepisu",
      recipeIngredient: newRecipeIngredient,
    });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas dodawania składnika",
      details: error.message,
    });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  // Dodano verifyToken
  const { id } = req.params;
  const { quantity, unit } = req.body;

  try {
    const recipeIngredient = await RecipeIngredient.findByPk(id);

    if (!recipeIngredient) {
      return res.status(404).json({ error: "Składnik nie został znaleziony" });
    }

    const updatedRecipeIngredient = await recipeIngredient.update({
      quantity: quantity !== undefined ? quantity : recipeIngredient.quantity,
      unit: unit !== undefined ? unit : recipeIngredient.unit,
    });

    res.json({
      message: "Składnik zaktualizowany pomyślnie",
      recipeIngredient: updatedRecipeIngredient,
    });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas aktualizowania składnika",
      details: error.message,
    });
  }
});

// 4. Usunięcie składnika z przepisu
router.delete("/:id", verifyToken, async (req, res) => {
  // Dodano verifyToken
  const { id } = req.params;

  try {
    const recipeIngredient = await RecipeIngredient.findByPk(id);

    if (!recipeIngredient) {
      return res.status(404).json({ error: "Składnik nie został znaleziony" });
    }

    await recipeIngredient.destroy();

    res.json({ message: "Składnik został usunięty z przepisu" });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas usuwania składnika",
      details: error.message,
    });
  }
});

module.exports = router;
