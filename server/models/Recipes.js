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
    });

    Recipe.associate = (models) => {
        Recipe.belongsToMany(models.Ingredient, {
            through: "RecipeIngredient",
            foreignKey: "recipe_id",
        });
    };

    return Recipe;
};
