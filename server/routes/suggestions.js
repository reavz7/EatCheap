const express = require('express');
const router = express.Router();
const { RecipeIngredient, Ingredient, UserIngredient, Recipe } = require('../models');
const { convertUnits } = require('../utils/unitConversion');
const verifyToken = require('../middleware/verifyToken');

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

// Endpoint do pobierania przepisów z filtrami
router.get('/', verifyToken, async (req, res) => {
    const userId = req.userId; // Używamy userId z tokena
    const { isVegan, isVegetarian, isGlutenFree } = req.query;

    try {
        // Budujemy warunki filtrów na podstawie query stringu
        const filterConditions = {};
        if (isVegan !== undefined) filterConditions.isVegan = isVegan === '1' ? 1 : 0;
        if (isVegetarian !== undefined) filterConditions.isVegetarian = isVegetarian === '1' ? 1 : 0;
        if (isGlutenFree !== undefined) filterConditions.isGlutenFree = isGlutenFree === '1' ? 1 : 0;

        // Pobranie przepisów uwzględniających filtry
        const recipes = await Recipe.findAll({
            where: filterConditions,
        });

        if (recipes.length === 0) {
            return res.status(404).json({ error: 'Nie znaleziono przepisów spełniających podane kryteria' });
        }

        // Pobieramy składniki użytkownika
        const userIngredients = await getUserIngredients(userId);

        const possibleRecipes = [];

        // Iteracja po przepisach i sprawdzanie, czy użytkownik ma składniki
        for (const recipe of recipes) {
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

            for (const recipeIngredient of recipeIngredients) {
                const requiredQuantity = convertUnits(recipeIngredient.quantity, recipeIngredient.unit, 'g'); // Wymagana ilość w gramach
                const ingredientId = recipeIngredient.ingredient_id;

                if (!userIngredients[ingredientId] || userIngredients[ingredientId] < requiredQuantity) {
                    canMakeRecipe = false;
                    break; // Jeśli brakuje składnika, przerywamy
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
