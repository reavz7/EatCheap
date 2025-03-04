module.exports = (sequelize, DataTypes) => {
    const Ingredient = sequelize.define("Ingredient", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      group: { // Określa możliwe jednostki
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Ingredient.associate = (models) => {
      Ingredient.belongsToMany(models.Recipe, {
        through: models.RecipeIngredient,
        foreignKey: "ingredient_id",
        as: "recipes",
      });
  
      Ingredient.hasMany(models.UserIngredient, {
        foreignKey: "ingredient_id",
        as: "userIngredients",
      });
    };
  
    return Ingredient;
  };
  