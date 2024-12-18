/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();


// Pobranie wszystkich użytkowników (bez hasła)
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({  
            attributes: { exclude: ['password'] }
        });
        res.json(users);        
    } catch (error) {
        res.status(500).json({ error: "Bład", details: error.message });
    }
});

// Pobranie konkretnego użytkownika przez ID
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie znaleziony" });
        }                                               
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

// Tworzenie nowego użytkownika
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Nazwa użytkownika, email i hasło są wymagane" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ 
            message: "Użytkownik utworzony pomyślnie", 
            user: { username: newUser.username, email: newUser.email } 
        });
    } catch (error) {
        console.error("Error creating user:", error); // Logowanie błędu
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});


// Login użytkownika
router.post("/login", async (req, res) => {
    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).json({ error: "Email i hasło są wymagane!" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User password hash from DB:", user.password); 
            return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
        }

        const match = await bcrypt.compare(password, user.password);
   
        if (!match) {
            console.log(user.password)
            console.log(password)
            console.log("User password hash from DB:", user.password); 
            return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
        }
        console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Zalogowano pomyślnie", token });
       

    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

    
// Middleware dla autoryzacji (token JWT)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: "Brak tokena, autoryzacja nie powiodła się" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: error  });
    }
};

// Ochronione trasy (np. dla użytkowników po zalogowaniu)
router.get("/protected", verifyToken, async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie znaleziony" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

// Aktualizacja danych użytkownika
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Nazwa użytkownika i email są wymagane!" });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie znaleziony" });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        const updatedUser = await user.update({ username, email, password: hashedPassword });
        res.json({
            message: "Dane użytkownika zaktualizowane pomyślnie",
            user: { username: updatedUser.username, email: updatedUser.email }
        });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

// Usunięcie użytkownika
router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Użytkownik nie znaleziony" });
        }
        await user.destroy();
        res.json({ message: "Użytkownik został usunięty" });
    } catch (error) {
        res.status(500).json({ error: "Błąd serwera", details: error.message });
    }
});

module.exports = router;
