const express = require('express');
const router = express.Router();
const { RecipeIngredient, Ingredient } = require('../models');

// 1. Pobranie wszystkich składników dla przepisu
router.get('/:recipeId', async (req, res) => {
    const { recipeId } = req.params;

    try {
        const ingredients = await RecipeIngredient.findAll({
            where: { recipe_id: recipeId },
            include: [
                { model: Ingredient, attributes: ['name', 'price', 'unit'] },
            ],
        });     

        if (ingredients.length === 0) {
            return res.status(404).json({ error: 'Brak składników dla tego przepisu' });
        }

        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania składników', details: error.message });
    }
});

// 2. Dodanie składnika do przepisu
router.post('/', async (req, res) => {
    const { recipe_id, ingredient_id, quantity, unit } = req.body;

    if (!recipe_id || !ingredient_id || !quantity) {
        return res.status(400).json({ error: 'Wymagane pola: recipe_id, ingredient_id, quantity' });
    }

    try {
        const newRecipeIngredient = await RecipeIngredient.create({
            recipe_id,
            ingredient_id,
            quantity,
            unit,
        });

        res.status(201).json({ message: 'Składnik dodany do przepisu', recipeIngredient: newRecipeIngredient });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas dodawania składnika', details: error.message });
    }
});

// 3. Aktualizacja ilości lub jednostki składnika
router.put('/:id', async (req, res) => {
    const { id } = req.params;  
    const { quantity, unit } = req.body;

    try {
        const recipeIngredient = await RecipeIngredient.findByPk(id);

        if (!recipeIngredient) {
            return res.status(404).json({ error: 'Składnik nie został znaleziony' });
        }

        const updatedRecipeIngredient = await recipeIngredient.update({
            quantity: quantity !== undefined ? quantity : recipeIngredient.quantity,
            unit: unit !== undefined ? unit : recipeIngredient.unit,
        });

        res.json({
            message: 'Składnik zaktualizowany pomyślnie',
            recipeIngredient: updatedRecipeIngredient,
        });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizowania składnika', details: error.message });
    }
});

// 4. Usunięcie składnika z przepisu
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const recipeIngredient = await RecipeIngredient.findByPk(id);

        if (!recipeIngredient) {
            return res.status(404).json({ error: 'Składnik nie został znaleziony' });
        }

        await recipeIngredient.destroy();

        res.json({ message: 'Składnik został usunięty z przepisu' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas usuwania składnika', details: error.message });
    }
});


module.exports = router;