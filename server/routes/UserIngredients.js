const express = require("express");
const router = express.Router();
const { UserIngredient, Ingredient  } = require("../models");
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

// Dodanie składnika do użytkownika
router.post("/", verifyToken, async (req, res) => {
  const { ingredientId, quantity, unit } = req.body;

  // Pobieranie userId z tokena (zamiast przekazywać go w req.body)
  const userId = req.userId;

  // Walidacja danych wejściowych
  if (!userId || !ingredientId || !quantity || !unit) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
  }

  try {
    // Sprawdzenie, czy składnik istnieje
    const ingredient = await Ingredient.findByPk(ingredientId);
    if (!ingredient) {
      return res.status(404).json({ error: "Składnik nie znaleziony" });
    }

    // Sprawdzanie, czy jednostka pasuje do grupy jednostek składnika
    if (!isValidUnit(unit, ingredient.group)) {
      return res.status(400).json({
        error: `Jednostka "${unit}" nie pasuje do grupy "${ingredient.group}" składnika "${ingredient.name}"`,
      });
    }

    // Sprawdzenie, czy użytkownik już dodał ten składnik
    const existingUserIngredient = await UserIngredient.findOne({
      where: { user_id: userId, ingredient_id: ingredientId },
    });

    if (existingUserIngredient) {
      // Jeśli składnik już istnieje, aktualizujemy jego ilość i jednostkę
      await existingUserIngredient.update({ quantity, unit });
      return res.json({
        message: "Składnik został zaktualizowany",
        userIngredient: existingUserIngredient,
      });
    }

    // Jeśli składnik nie istnieje, dodajemy go do bazy
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

    // Pobieramy składnik, aby sprawdzić jego grupę jednostek
    const ingredient = await Ingredient.findByPk(userIngredient.ingredient_id);
    if (!ingredient) {
      return res.status(404).json({ error: "Składnik bazowy nie został znaleziony" });
    }

    // Walidacja jednostki
    if (!isValidUnit(unit, ingredient.group)) {
      return res.status(400).json({
        error: `Jednostka "${unit}" nie pasuje do grupy "${ingredient.group}" składnika "${ingredient.name}"`,
      });
    }

    // Aktualizujemy ilość i jednostkę składnika użytkownika
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
