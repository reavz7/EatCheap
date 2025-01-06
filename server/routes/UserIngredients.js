// Przykład dla routingu dla UserIngredients:
const express = require('express');
const router = express.Router();
const { UserIngredient } = require('../models');
const verifyToken = require('../middleware/verifyToken'); // Import funkcji verifyToken

// Pobranie wszystkich składników użytkownika
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // userId pochodzący z verifyToken
    try {
        const userIngredients = await UserIngredient.findAll({ 
            where: { user_id: userId } 
        });
        res.json(userIngredients);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas pobierania składników", details: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { ingredient_id, quantity, unit } = req.body;
    const userId = req.userId; 

    if (!ingredient_id || !quantity) {
        return res.status(400).json({ error: "ingredient_id i quantity są wymagane" });
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
        res.status(500).json({ error: "Błąd podczas dodawania składnika", details: error.message });
    }
});


router.put('/:id', verifyToken, async (req, res) => {
    const userId = req.userId;
    const { ingredient_id, quantity, unit } = req.body;
    const userIngredientId = req.params.id;

    try {
        const userIngredient = await UserIngredient.findOne({ 
            where: { id: userIngredientId, user_id: userId } 
        });

        if (!userIngredient) {
            return res.status(404).json({ error: "Składnik użytkownika nie znaleziony" });
        }

        const updatedUserIngredient = await userIngredient.update({
            ingredient_id,
            quantity,
            unit,
        });

        res.json(updatedUserIngredient);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas aktualizacji składnika", details: error.message });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    const userId = req.userId;
    const userIngredientId = req.params.id;

    try {
        const userIngredient = await UserIngredient.findOne({ 
            where: { id: userIngredientId, user_id: userId } 
        });

        if (!userIngredient) {
            return res.status(404).json({ error: "Składnik użytkownika nie znaleziony" });
        }

        await userIngredient.destroy();
        res.json({ message: "Składnik użytkownika został usunięty" });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas usuwania składnika", details: error.message });
    }
});


module.exports = router;
