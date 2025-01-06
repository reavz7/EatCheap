const express = require('express');
const router = express.Router();
const { Recipe, Ingredient, UserIngredient, Budget, RecipeIngredient } = require('../models');
const verifyToken = require('../middleware/verifyToken');

// Sugestia przepisów
router.get('/', verifyToken, async (req, res) => {
    const { userId } = req;

    try {       
        // 1. Pobierz składniki użytkownika
        const userIngredients = await UserIngredient.findAll({
            where: { user_id: userId },
            include: { 
                model: Ingredient, 
                as: 'ingredient' // Alias 'ingredient' dla Ingredients
            },
        });

        // 2. Pobierz budżet użytkownika
        const budget = await Budget.findOne({ where: { user_id: userId } });
        if (!budget) {
            return res.status(404).json({ error: "Budżet użytkownika nie został znaleziony." });
        }

        // 3. Pobierz wszystkie przepisy i ich składniki
        const recipes = await Recipe.findAll({
            include: {
                model: Ingredient,
                through: { model: RecipeIngredient },
                as: 'Ingredients' // Alias 'Ingredients' w związku z RecipeIngredient
            },
        });

        // 4. Analizuj przepisy
        const suggestions = [];

        for (const recipe of recipes) {
            let isPossible = true;
            let extraCost = 0;
            const missingIngredients = [];

            for (const recipeIngredient of recipe.Ingredients) {
                const userIngredient = userIngredients.find(
                    (ui) => ui.ingredient.id === recipeIngredient.id
                );

                // Sprawdź, czy użytkownik ma wymagany składnik
                if (userIngredient) {
                    // Konwersja jednostek
                    const userQuantity =
                        userIngredient.ingredient.unit === recipeIngredient.unit
                            ? userIngredient.ingredient.quantity
                            : convertUnits(userIngredient.ingredient.quantity, userIngredient.ingredient.unit, recipeIngredient.unit);

                    if (userQuantity < recipeIngredient.RecipeIngredient.quantity) {
                        isPossible = false;
                        missingIngredients.push({
                            ingredient: recipeIngredient.name,
                            needed: recipeIngredient.RecipeIngredient.quantity - userQuantity,
                            unit: recipeIngredient.unit,
                        });
                    }
                } else {
                    // Składnik brakujący, sprawdzamy cenę
                    isPossible = false;
                    const ingredientPrice = recipeIngredient.price;
                    const neededQuantity = recipeIngredient.RecipeIngredient.quantity;

                    extraCost += ingredientPrice * neededQuantity;
                    missingIngredients.push({
                        ingredient: recipeIngredient.name,
                        needed: neededQuantity,
                        unit: recipeIngredient.unit,
                        price: ingredientPrice * neededQuantity,
                    });
                }
            }

            // Jeśli przepis jest możliwy lub braki mieszczą się w budżecie, dodaj go do sugestii
            if (isPossible || extraCost <= budget.amount) {
                suggestions.push({
                    recipe: recipe.name,
                    description: recipe.description,
                    instructions: recipe.instructions,
                    missingIngredients,
                    totalExtraCost: extraCost,
                    canAfford: extraCost <= budget.amount,
                });
            }
        }

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: "Błąd podczas analizy przepisów", details: error.message });
    }
});

// Funkcja konwersji jednostek
function convertUnits(quantity, fromUnit, toUnit) {
    const conversionRates = {
        kg: 1000, // kg na g
        g: 1,
        l: 1000, // l na ml
        ml: 1,
    };

    if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
        throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
    }

    return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

module.exports = router;
