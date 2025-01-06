const express = require('express');
const router = express.Router();
const { UserIngredient } = require('../models');


// Pobranie wszystkich składników użytkownika
router.get('/', async (req, res) => {
    const userId = req.userId; 
    try {
        const userIngredients = await UserIngredient.findAll({ where: { userId } });
        res.json(userIngredients);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas pobierania składników", details: error.message });
    }
});

// Dodanie nowego składnika dla użytkownika
router.post('/', async (req, res) => {
    const { name, price, unit } = req.body;
    const userId = req.userId; 

    if (!name || !price) {
        return res.status(400).json({ error: "Nazwa i cena są wymagane!" });
    }

    try {
        const newIngredient = await UserIngredient.create({ userId, name, price, unit });
        res.status(201).json({ message: "Składnik dodany pomyślnie", ingredient: newIngredient });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas dodawania składnika", details: error.message });
    }
});

// Aktualizacja składnika użytkownika
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, unit } = req.body;

    try {
        const ingredient = await UserIngredient.findByPk(id);
        if (!ingredient) {
            return res.status(404).json({ error: "Składnik nie znaleziony" });
        }

        const updatedIngredient = await ingredient.update({
            name: name || ingredient.name,
            price: price !== undefined ? price : ingredient.price,
            unit: unit || ingredient.unit,
        });

        res.json({ message: "Składnik zaktualizowany pomyślnie", ingredient: updatedIngredient });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas aktualizacji składnika", details: error.message });
    }
});

// Usunięcie składnika użytkownika
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ingredient = await UserIngredient.findByPk(id);
        if (!ingredient) {
            return res.status(404).json({ error: "Składnik nie znaleziony" });
        }

        await ingredient.destroy();
        res.json({ message: "Składnik usunięty pomyślnie" });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas usuwania składnika", details: error.message });
    }
});

module.exports = router;
