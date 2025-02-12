const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");

app.use(cors());

// Middleware
app.use(express.json()); // Parsowanie JSON
app.use("/users", require("./routes/Users"));
app.use("/recipes", require("./routes/Recipes"));
app.use("/ingredients", require("./routes/Ingredients"));
app.use("/recipeingredients", require("./routes/RecipeIngredients"));
app.use("/useringredients", require("./routes/UserIngredients"));
app.use("/suggestions", require("./routes/suggestions"));

// Synchronizacja w odpowiedniej kolejności
(async () => {
  try {
    await db.User.sync({ force: false }); 
    console.log("Tabela Users zsynchronizowana.");

    await db.Ingredient.sync({ force: false }); 
    console.log("Tabela Ingredients zsynchronizowana.");

    await db.Recipe.sync({ force: false }); 
    console.log("Tabela Recipes zsynchronizowana.");

    await db.RecipeIngredient.sync({ force: false }); 
    console.log("Tabela RecipeIngredients zsynchronizowana.");

    await db.UserIngredient.sync({ force: false }); 
    console.log("Tabela UserIngredients zsynchronizowana.");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("Błąd synchronizacji bazy danych:", err);
  }
})();
