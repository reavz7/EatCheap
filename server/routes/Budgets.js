const express = require('express');
const router = express.Router();
const {Budget, User} = require('../models');

// Pobranie budżetu użytkownika
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const budget = await Budget.findOne({
            where: { user_id: userId },
        });

        if (!budget) {
            return res.status(404).json({ error: 'Budżet dla tego użytkownika nie został znaleziony' });
        }

        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania budżetu', details: error.message });
    }
});

// 2. Dodanie budżetu
router.post('/', async (req, res) => {
    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
        return res.status(400).json({ error: 'Wymagane pola: user_id, amount' });
    }

    try {
        const existingBudget = await Budget.findOne({ where: { user_id } });

        if (existingBudget) {
            return res.status(400).json({ error: 'Ten użytkownik już posiada budżet' });
        }

        const newBudget = await Budget.create({ user_id, amount });

        res.status(201).json({ message: 'Budżet został utworzony', budget: newBudget });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas tworzenia budżetu', details: error.message });
    }
});

// 3. Aktualizacja budżetu przez dodanie/odjęcie kwoty
router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { amountChange } = req.body; // amountChange: liczba do dodania/odjęcia

    if (amountChange === undefined) {
        return res.status(400).json({ error: 'Pole amountChange jest wymagane' });
    }

    try {
        const budget = await Budget.findOne({ where: { user_id: userId } });

        if (!budget) {
            return res.status(404).json({ error: 'Budżet dla tego użytkownika nie został znaleziony' });
        }

        // Aktualizacja budżetu przez dodanie lub odjęcie kwoty
        const newAmount = budget.amount + amountChange;

        // Sprawdzenie, czy budżet nie spada poniżej zera
        if (newAmount < 0) {
            return res.status(400).json({ error: 'Budżet nie może być ujemny' });
        }

        await budget.update({ amount: newAmount });

        res.json({ message: 'Budżet został zaktualizowany', newAmount });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizowania budżetu', details: error.message });
    }
});

// 4. Usunięcie budżetu
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const budget = await Budget.findOne({ where: { user_id: userId } });

        if (!budget) {
            return res.status(404).json({ error: 'Budżet dla tego użytkownika nie został znaleziony' });
        }

        await budget.destroy();

        res.json({ message: 'Budżet został usunięty' });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas usuwania budżetu', details: error.message });
    }
});

module.exports = router;