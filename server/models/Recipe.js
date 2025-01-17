module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define("Recipe", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVegan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVegetarian: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isGlutenFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      // Dodana kolumna user_id
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Nawiązanie do tabeli 'users' w bazie danych
        key: "id",
      },
    },
  });

  Recipe.associate = (models) => {
    Recipe.belongsToMany(models.Ingredient, {
      through: models.RecipeIngredient,
      foreignKey: "recipe_id",
      as: "Ingredients",
    });

    // Dodanie powiązania z modelem User (użytkownikiem)
    Recipe.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return Recipe;
};
