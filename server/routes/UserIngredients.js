const express = require("express");
const router = express.Router();
const { UserIngredient, Ingredient } = require("../models");
const verifyToken = require("../middleware/verifyToken"); // Import funkcji verifyToken
const { isValidUnit } = require("../utils/unitAllowed");

// 1 Pobranie wszystkich składników użytkownika
router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Pobieramy userId z tokena

  try {
    const userIngredients = await UserIngredient.findAll({
      where: { user_id: userId },
    });
    res.json(userIngredients);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania składników",
      details: error.message,
    });
  }
});

// 2 Dodanie składnika do użytkownika
router.post("/", verifyToken, async (req, res) => {
  const { ingredientId, quantity, unit } = req.body;

  const userId = req.userId;

  if (!userId || !ingredientId || !quantity || !unit) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
  }
  
  if (quantity <= 0) {
    return res.status(400).json({ error: "Ilość składnika musi być większa od zera!" });
  }
  

  try {
    const ingredient = await Ingredient.findByPk(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ error: "Składnik nie znaleziony" });
    }

    if (!isValidUnit(unit, ingredient.group)) {
      return res.status(400).json({
        error: `Jednostka "${unit}" nie pasuje do grupy "${ingredient.group}" składnika "${ingredient.name}"`,
      });
    }

    const existingUserIngredient = await UserIngredient.findOne({
      where: { user_id: userId, ingredient_id: ingredientId },
    });

    if (existingUserIngredient) {
      await existingUserIngredient.update({ quantity, unit });
      return res.json({
        message: "Składnik został zaktualizowany",
        userIngredient: existingUserIngredient,
      });
    }

    const newUserIngredient = await UserIngredient.create({
      user_id: userId,
      ingredient_id: ingredientId,
      quantity,
      unit,
    });

    res.status(201).json({
      message: "Składnik dodany do użytkownika pomyślnie",
      userIngredient: newUserIngredient,
    });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas dodawania składnika",
      details: error.message,
    });
  }
});

// 3 Aktualizacja składnika użytkownika
router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.userId;
  const ingredientId = req.params.id;
  const { quantity, unit } = req.body;

  try {
    const userIngredient = await UserIngredient.findOne({
      where: { id: ingredientId, user_id: userId },
    });
    if (!userIngredient) {
      return res.status(404).json({ error: "Składnik nie został znaleziony" });
    }

    const ingredient = await Ingredient.findByPk(userIngredient.ingredient_id);
    if (!ingredient) {
      return res
        .status(404)
        .json({ error: "Składnik bazowy nie został znaleziony" });
    }

    // Walidacja jednostki
    if (!isValidUnit(unit, ingredient.group)) {
      return res.status(400).json({
        error: `Jednostka "${unit}" nie pasuje do grupy "${ingredient.group}" składnika "${ingredient.name}"`,
      });
    }

    await userIngredient.update({ quantity, unit });
    res.json({
      message: "Składnik został pomyślnie zaktualizowany",
      userIngredient,
    });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas aktualizacji składnika",
      details: error.message,
    });
  }
});

// Usunięcie składnika użytkownika
router.delete("/:id", verifyToken, async (req, res) => {
  const userId = req.userId; // Pobieramy userId z tokena
  const ingredientId = req.params.id;

  try {
    const userIngredient = await UserIngredient.findOne({
      where: { id: ingredientId, user_id: userId },
    });
    if (!userIngredient) {
      return res.status(404).json({ error: "Składnik nie został znaleziony" });
    }

    await userIngredient.destroy();
    res.json({ message: "Składnik został usunięty" });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas usuwania składnika",
      details: error.message,
    });
  }
});

module.exports = router;
