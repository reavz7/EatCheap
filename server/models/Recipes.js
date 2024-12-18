module.exports = (sequelize, DataTypes) => {
    const Recipes = sequelize.define("Recipes", {
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
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
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
    });

    Recipes.associate = (models) => {
        Recipes.belongsToMany(models.Ingredients, {
            through: "RecipeIngredient",
            foreignKey: "recipeId",
        });
    };

    return Recipes;
};
