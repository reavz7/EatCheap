const express = require('express');
const router = express.Router();
const { Users } = require('../models');

// Pobranie wszystkich użytkowników (może być tylko do testów! dlatego ukrywam hasło)
router.get("/", async (req, res) => {
    const listOfUsers = await Users.findAll({
        attributes: { exclude: ['password'] } // Ukrywanie hasła
    });
    res.json(listOfUsers);
});

// Tworzenie użytkownika
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    // Walidacja podstawowa
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
    }

    try {
        const newUser = await Users.create({ username, email, password });
        res.status(201).json({ 
            message: "Użytkownik utworzony pomyślnie", 
            user: { username: newUser.username, email: newUser.email } 
        });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

module.exports = router;
