const express = require('express');
const router = express.Router();
const { Budget } = require('../models');
const verifyToken = require('../middleware/verifyToken');

// 1. Pobranie budżetu użytkownika
router.get('/', verifyToken, async (req, res) => {
    try {
        // Używamy userId z middleware verifyToken
        const budget = await Budget.findOne({ where: { user_id: req.userId } });
        
        if (!budget) {
            return res.status(404).json({ error: 'Budżet dla tego użytkownika nie został znaleziony' });
        }

        res.json(budget);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania budżetu', details: error.message });
    }
});

// 2. Aktualizacja budżetu przez dodanie/odjęcie kwoty
router.put('/', verifyToken, async (req, res) => {
    const { amountChange } = req.body;

    if (amountChange === undefined) {
        return res.status(400).json({ error: 'Pole amountChange jest wymagane' });
    }

    try {
        // Używamy userId z middleware verifyToken
        const budget = await Budget.findOne({ where: { user_id: req.userId } });

        if (!budget) {
            return res.status(404).json({ error: 'Budżet dla tego użytkownika nie został znaleziony' });
        }

        const newAmount = budget.amount + amountChange;

        if (newAmount < 0) {
            return res.status(400).json({ error: 'Budżet nie może być ujemny' });
        }

        await budget.update({ amount: newAmount });

        res.json({ message: 'Budżet został zaktualizowany', newAmount });
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas aktualizowania budżetu', details: error.message });
    }
});

module.exports = router;
