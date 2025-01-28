/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Pobranie wszystkich użytkowników (bez hasła)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Błąd", details: error.message });
  }
});

// Ochronione trasy (np. dla użytkowników po zalogowaniu)
router.get("/protected", verifyToken, async (req, res) => {
  const userId = req.userId;
  console.log("Requesting user with ID:", userId);

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      console.error("User not found in database for ID:", userId);
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }
    console.log("Found user:", user);
    res.json(user);
  } catch (error) {
    console.error("Database error:", error.message);
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
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
    }

    const token = jwt.sign(
      { id: user.id, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Zalogowano pomyślnie",
      token,
      admin: user.admin,
    });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
});

// Tworzenie nowego użytkownika
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  // Walidacja danych
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Nazwa użytkownika, email i hasło są wymagane" });
  }

  // Sprawdzenie, czy e-mail ma poprawny format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Niepoprawny format e-maila" });
  }

  try {
    // Sprawdzanie, czy e-mail już istnieje
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "E-mail jest już zajęty" });
    }

    // Sprawdzanie, czy nazwa użytkownika już istnieje
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: "Nazwa użytkownika jest już zajęta" });
    }

    // Jeśli e-mail i nazwa są unikalne, tworzę nowego użytkownika
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Użytkownik utworzony pomyślnie",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
});



// Pobranie id zalogowanie uzytkownika
router.get("/info", verifyToken, async (req, res) => {
  const userId = req.userId; // Pobierz ID użytkownika z tokena
  try { 
    const userInfo = await User.findByPk(userId); // Znajdź użytkownika w bazie
    if (!userInfo) { // Jeśli użytkownik nie istnieje
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }
    res.json({
      user: { username: userInfo.username, email: userInfo.email }, // Zwróć dane użytkownika
    });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera", details: error.message }); // Obsłuż błąd serwera
  }
});


// Aktualizacja danych użytkownika
router.put("/", verifyToken, async (req, res) => {
  const userId = req.userId; // Pobierz ID użytkownika z tokena
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(userId); // Znajdź użytkownika na podstawie ID z tokena
    if (!user) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    // Przygotuj obiekt aktualizacji tylko z przesłanych pól
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    // Jeśli żadne dane nie zostały przesłane
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Brak danych do aktualizacji" });
    }

    // Aktualizuj użytkownika
    await user.update(updates);

    res.json({
      message: "Dane użytkownika zaktualizowane pomyślnie",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
});



// Usunięcie użytkownika
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
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
