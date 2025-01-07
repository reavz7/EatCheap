const express = require('express');
const router = express.Router();
const { Recipe, Ingredient, UserIngredient, RecipeIngredient } = require('../models');
const verifyToken = require('../middleware/verifyToken');
const { convertUnits } = require('../utils/unitConversion');

// Sugestia przepisów
router.get('/', verifyToken, async (req, res) => {
    const { userId } = req;

    try {
        // Pobierz składniki użytkownika
        const userIngredients = await UserIngredient.findAll({
            where: { user_id: userId },
            include: {
                model: Ingredient,
                as: 'ingredient',
            },
        });

        // Pobierz przepisy i ich wymagane składniki
        const recipes = await Recipe.findAll({
            include: {
                model: Ingredient,
                through: { model: RecipeIngredient },
                as: 'Ingredients', // alias dla powiązania z RecipeIngredient
            },
        });

        const suggestions = [];

        // Sprawdź każdy przepis
        for (const recipe of recipes) {
            let isPossible = true;

            // Sprawdź składniki przepisu
            for (const recipeIngredient of recipe.Ingredients) {
                const userIngredient = userIngredients.find(
                    (ui) => ui.ingredient_id === recipeIngredient.id
                );

                if (userIngredient) {
                    // Użytkownik ma składnik - konwersja jednostek
                    const userQuantity =
                        userIngredient.unit === recipeIngredient.unit
                            ? userIngredient.quantity // Jednostki są takie same
                            : convertUnits(userIngredient.quantity, userIngredient.unit, recipeIngredient.unit); // Konwersja jednostek

                    if (userQuantity < recipeIngredient.RecipeIngredient.quantity) {
                        isPossible = false; // Ilość niewystarczająca
                        break;
                    }
                } else {
                    isPossible = false; // Brakuje składnika
                    break;
                }
            }

            // Dodaj przepis do sugestii, jeśli możliwy
            if (isPossible) {
                suggestions.push({
                    recipeName: recipe.name,
                    description: recipe.description,
                    instructions: recipe.instructions,
                });
            }
        }

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas analizy przepisów", details: error.message });
    }
});

module.exports = router;
