const express = require('express');
const router = express.Router();
const { Recipes } = require('../models');

// Pobieranie wszystkich przepisów
router.get("/", async (req, res) => {
    const listOfRecipes = await Recipes.findAll();
    res.json(listOfRecipes);
});


module.exports = router;
