const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models');

router.get('/', async(req, res)=>{
    try{
        const allIngredients = await Ingredient.findAll();
        res.json(allIngredients);
    }
    catch(error){
        res.status(500).json({error: "Błąd pobierania danych", details: error.message})
    }
})
router.get('/:id', async(req, res)=>{
    const ingredientId = req.params.id;
    
    try{    
        const ingredient = await Ingredient.findByPk(ingredientId, {
            attributes: {}  
        });
       if(!ingredient){
        return res.status(404).json({ error: "Dodatek nie znaleziony" });
       }
    }
    catch(error){
        res.status(500).json({error: "Błąd pobierania danych", details: error.message})
    }
})

module.exports = router;