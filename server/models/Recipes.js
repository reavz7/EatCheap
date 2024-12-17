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
    });

    Recipes.associate = (models) => {
        Recipes.belongsToMany(models.Ingredients, {
            through: "RecipeIngredients",
            foreignKey: "recipeId",
        });
    };

    return Recipes;
};
