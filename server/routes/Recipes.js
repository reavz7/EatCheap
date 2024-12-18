const express = require('express');
const router = express.Router();
const { Recipe } = require('../models');

// Pobranie wszystkich przepisów
router.get('/', async (req, res) => {
    try {
        const allRecipes = await Recipe.findAll();
        res.json(allRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania przepisów', details: error.message });
    }
});

// Tworzenie nowego przepisu
router.post('/', async (req, res) => {
    const { name, description, instructions, isVegan, isVegetarian, isGlutenFree } = req.body;

    // Walidacja podstawowa
    if (!name || !instructions) {
        return res.status(400).json({ error: 'Nazwa i instrukcje są wymagane!' });
    }

    try {
        const newRecipe = await Recipe.create({
            name,
            instructions,
            description,
            isVegan: isVegan || false,
            isVegetarian: isVegetarian || false,
            isGlutenFree: isGlutenFree || false,
        });

        res.status(201).json({ message: 'Przepis utworzony pomyślnie', recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas tworzenia przepisu', details: error.message });
    }
});

module.exports = router;
