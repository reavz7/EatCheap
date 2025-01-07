const express = require('express');
const router = express.Router();
const { RecipeIngredient, Ingredient, UserIngredient, Recipe } = require('../models');
const { convertUnits } = require('../utils/unitConversion');
const verifyToken = require('../middleware/verifyToken'); // Importowanie middleware

// Funkcja do obliczenia dostępnych składników użytkownika
async function getUserIngredients(userId) {
    const userIngredients = await UserIngredient.findAll({
        where: { user_id: userId },
    });

    const userIngredientData = {};
    userIngredients.forEach(ingredient => {
        const ingredientId = ingredient.ingredient_id;
        if (!userIngredientData[ingredientId]) {
            userIngredientData[ingredientId] = 0;
        }
        userIngredientData[ingredientId] += convertUnits(ingredient.quantity, ingredient.unit, 'g'); // Przelicz na gramy
    });

    return userIngredientData;
}

// Endpoint do pobierania przepisów (z weryfikacją tokena)
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // Używamy userId z tokena

    try {
        // Pobieramy składniki, które ma użytkownik
        const userIngredients = await getUserIngredients(userId);

        // Pobranie wszystkich przepisów, które mogą być wykonane przez użytkownika
        const recipes = await Recipe.findAll();

        const possibleRecipes = [];

        // Iteracja po wszystkich przepisach
        for (const recipe of recipes) {
            // Pobranie składników wymaganych przez dany przepis
            const recipeIngredients = await RecipeIngredient.findAll({
                where: { recipe_id: recipe.id },
                include: [
                    {
                        model: Ingredient,
                        as: 'ingredient',
                        attributes: ['name', 'unit', 'price'],
                    },
                ],
            });

            let canMakeRecipe = true; // Flaga, czy użytkownik ma wszystkie składniki

            // Iteracja po składnikach przepisu
            for (const recipeIngredient of recipeIngredients) {
                const requiredQuantity = convertUnits(recipeIngredient.quantity, recipeIngredient.unit, 'g'); // Wymagana ilość w gramach
                const ingredientId = recipeIngredient.ingredient_id;

                // Sprawdzamy, czy użytkownik ma wystarczającą ilość tego składnika
                if (!userIngredients[ingredientId] || userIngredients[ingredientId] < requiredQuantity) {
                    canMakeRecipe = false;
                    break; // Jeżeli użytkownik nie ma wystarczającej ilości składnika, przerywamy
                }
            }

            if (canMakeRecipe) {
                possibleRecipes.push({
                    recipeId: recipe.id,
                    recipeName: recipe.name,
                    message: `Masz wystarczające składniki, aby przygotować ten przepis!`,
                });
            }
        }

        if (possibleRecipes.length === 0) {
            return res.status(404).json({ error: 'Brak przepisów, które użytkownik może przygotować z dostępnych składników' });
        }

        res.json(possibleRecipes);
    } catch (error) {
        res.status(500).json({ error: 'Błąd podczas pobierania przepisów', details: error.message });
    }
});

module.exports = router;
