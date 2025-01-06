module.exports = (sequelize, DataTypes) => {
    const RecipeIngredient = sequelize.define("RecipeIngredient", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Recipes",
                key: "id",
            },
        },
        ingredient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Ingredients",
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    RecipeIngredient.associate = (models) => {
        RecipeIngredient.belongsTo(models.Ingredient, {
            foreignKey: 'ingredient_id',
        });
    };

    return RecipeIngredient;
};