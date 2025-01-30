const express = require("express");
const router = express.Router();
const { Recipe } = require("../models");
const verifyToken = require("../middleware/verifyToken");
const { Op } = require("sequelize");
const verifyAdmin = require("../middleware/verifyAdmin");

// Pobranie wszystkich przepisów
router.get("/", verifyToken, async (req, res) => {
  try {
    const allRecipes = await Recipe.findAll();
    res.json(allRecipes);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania przepisów",
      details: error.message,
    });
  }
});

// Filtrowanie przepisów
router.get("/search", verifyToken, async (req, res) => {
  const { isVegan, isVegetarian, isGlutenFree } = req.query;

  try {
    const filters = {};

    if (isVegan !== undefined) filters.isVegan = isVegan === "true";
    if (isVegetarian !== undefined)
      filters.isVegetarian = isVegetarian === "true";
    if (isGlutenFree !== undefined)
      filters.isGlutenFree = isGlutenFree === "true";

    const filteredRecipes = await Recipe.findAll({
      where: filters,
    });

    res.json(filteredRecipes);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas filtrowania przepisów",
      details: error.message,
    });
  }
});

// Pobranie pojedynczego przepisu po ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie został znaleziony" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania przepisu",
      details: error.message,
    });
  }
});

// Tworzenie nowego przepisu
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const {
    name,
    description,
    instructions,
    isVegan,
    isVegetarian,
    isGlutenFree,
    averagePreparationTime,
    imageUrl,
  } = req.body;

  if (!name || !instructions || averagePreparationTime === undefined) {
    return res
      .status(400)
      .json({ error: "Nazwa, instrukcje i czas przygotowania są wymagane!" });
  }

  if (
    typeof isVegan !== "boolean" ||
    typeof isVegetarian !== "boolean" ||
    typeof isGlutenFree !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "isVegan, isVegetarian i isGlutenFree muszą być wartościami typu boolean.",
    });
  }

  try {
    // sprawdzenie czy uzytkownik zrobil juz dzisiaj przepis, bo moze zrobic jeden na dzien
    const todayRecipes = await Recipe.findOne({
      where: {
        user_id: req.userId,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lt]: new Date().setHours(23, 59, 59, 999),
        },
      },
    });

    if (todayRecipes) {
      return res
        .status(403)
        .json({ error: "Możesz dodać tylko jeden przepis dziennie." });
    }

    const newRecipe = await Recipe.create({
      name,
      instructions,
      description,
      isVegan: isVegan || false,
      isVegetarian: isVegetarian || false,
      isGlutenFree: isGlutenFree || false,
      user_id: req.userId,
      averagePreparationTime,
      imageUrl: imageUrl || null, // Dodanie obrazu
    });

    res
      .status(201)
      .json({ message: "Przepis utworzony pomyślnie", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas tworzenia przepisu",
      details: error.message,
    });
  }
});

// Aktualizacja przepisu
router.put("/:id", verifyToken, verifyAdmin,  async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    instructions,
    isVegan,
    isVegetarian,
    isGlutenFree,
    averagePreparationTime,
    imageUrl,
  } = req.body;

  if (averagePreparationTime === undefined) {
    return res.status(400).json({ error: "Czas przygotowania jest wymagany!" });
  }

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie został znaleziony" });
    }

    if (recipe.user_id !== req.userId) {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do edytowania tego przepisu" });
    }

    // Aktualizacja przepisu
    const updatedRecipe = await recipe.update({
      name: name || recipe.name,
      description: description || recipe.description,
      instructions: instructions || recipe.instructions,
      isVegan: isVegan !== undefined ? isVegan : recipe.isVegan,
      isVegetarian:
        isVegetarian !== undefined ? isVegetarian : recipe.isVegetarian,
      isGlutenFree:
        isGlutenFree !== undefined ? isGlutenFree : recipe.isGlutenFree,
      averagePreparationTime,
      imageUrl: imageUrl || recipe.imageUrl, // Aktualizacja zdjęcia
    });

    res.json({
      message: `Przepis na ${name} został pomyślnie zaktualizowany!`,
      recipe: updatedRecipe,
    });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas aktualizowania danych przepisu",
      details: error.message,
    });
  }
});

// Usuwanie przepisu
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ error: "Przepis nie został znaleziony" });
    }

    if (recipe.user_id !== req.userId) {
      return res
        .status(403)
        .json({ error: "Brak uprawnień do usuwania tego przepisu" });
    }

    await recipe.destroy();

    res.json({ message: `Przepis został pomyślnie usunięty!` });
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas usuwania przepisu",
      details: error.message,
    });
  }
});

module.exports = router;
