module.exports = (sequelize, DataTypes) => {
    const Ingredients = sequelize.define("Ingredients", {
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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    Ingredients.associate = (models) => {
        Ingredients.belongsToMany(models.Recipes, {
            through: "RecipeIngredients",
            foreignKey: "ingredientId",
        });
    };

    return Ingredients;
};
