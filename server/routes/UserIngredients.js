const express = require("express");
const router = express.Router();
const { UserIngredient } = require("../models");
const verifyToken = require("../middleware/verifyToken"); // Import funkcji verifyToken
const { isValidUnit } = require("../utils/unitAllowed");

// Pobranie wszystkich składników użytkownika (z autoryzacją)
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

// Dodanie nowego składnika dla użytkownika
router.post("/", verifyToken, async (req, res) => {
  const { userId } = req;
  const { ingredient_id, quantity, unit } = req.body;

  // Sprawdzamy, czy jednostka jest dozwolona
  if (!isValidUnit(unit)) {
    return res.status(400).json({ error: `Niedozwolona jednostka: ${unit}` });
  }

  if (!ingredient_id || !quantity || !unit) {
    return res
      .status(400)
      .json({ error: "Wymagane są ingredient_id, quantity i unit" });
  }

  try {
    const newUserIngredient = await UserIngredient.create({
      user_id: userId,
      ingredient_id,
      quantity,
      unit,
    });
    res.status(201).json(newUserIngredient);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas tworzenia składnika",
      details: error.message,
    });
  }
});

// Aktualizacja składnika użytkownika
router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.userId; // Pobieramy userId z tokena
  const ingredientId = req.params.id; // Id składnika do edycji
  const { quantity, unit } = req.body;

  try {
    const userIngredient = await UserIngredient.findOne({
      where: { id: ingredientId, user_id: userId },
    });
    if (!userIngredient) {
      return res.status(404).json({ error: "Składnik nie został znaleziony" });
    }

    await userIngredient.update({ quantity, unit });
    res.json(userIngredient);
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
