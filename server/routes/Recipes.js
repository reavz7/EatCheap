const express = require('express');
const router = express.Router();
const { Recipes } = require('../models');

// Pobieranie wszystkich przepisów
router.get("/", async (req, res) => {
    const listOfRecipes = await Recipes.findAll();
    res.json(listOfRecipes);
});

// Tworzenie nowego przepisu
router.post("/", async (req, res) => {
    const { name, description, ingredients, totalCost, type } = req.body;

    if (!name || !ingredients || !totalCost) {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
    }

    try {
        const newRecipe = await Recipes.create({ name, description, ingredients, totalCost, type });
        res.status(201).json({ message: "Przepis dodany pomyślnie!", recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

module.exports = router;
