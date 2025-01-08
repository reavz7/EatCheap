const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models');
const { Op } = require('sequelize'); // import z sequelize biblioteki (to jest cos takiego jak w SQL like po prostu, i bedzie tu potrzebne)
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/verifyToken');
// Wszystkie składniki
router.get('/', async(req, res)=>{
    try{
        const allIngredients = await Ingredient.findAll();
        res.json(allIngredients);
    }
    catch(error){
        res.status(500).json({error: "Błąd pobierania danych", details: error.message})
    }
})  
// Składnik po ID
router.get('/:id', async (req, res) => {
    const ingredientId = req.params.id;

    try {
        const ingredient = await Ingredient.findByPk(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ error: "Dodatek nie znaleziony" });
        }

        // Zwróć znaleziony składnik
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ error: "Błąd pobierania danych", details: error.message });
    }
});

// Dodanie nowego składnika
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const { name, price, unit } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: "Nazwa i cena są wymagane!" });
    }

    try {
        const newIngredient = await Ingredient.create({ name, price, unit });
        res.status(201).json({ message: "Składnik dodany pomyślnie", ingredient: newIngredient });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas dodawania składnika", details: error.message });
    }
});

// Aktualizacja istniejącego skladnika
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, price, unit } = req.body;

    try {
        const ingredient = await Ingredient.findByPk(id);
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
        res.status(500).json({ error: "Błąd podczas aktualizowania składnika", details: error.message });
    }
});

// Usuwanie istniejacego skladnika
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const ingredient = await Ingredient.findByPk(id);
        if (!ingredient) {
            return res.status(404).json({ error: "Składnik nie znaleziony" });
        }

        await ingredient.destroy();
        res.json({ message: "Składnik usunięty pomyślnie: " + ingredient.name });
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas usuwania składnika", details: error.message });
    }
}); 

// WYSZUKANIE SKLADNIKOW PO NAZWIE

router.get('/search', async (req, res) => {
    const { name } = req.query;

    try {
        const ingredients = await Ingredient.findAll({
            where: {
                name: { [Op.like]: `%${name}%` },
            },
        });

        if (ingredients.length === 0) {
            return res.status(404).json({ error: "Nie znaleziono składników" });
        }

        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas wyszukiwania składników", details: error.message });
    }
});



module.exports = router;