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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    Ingredient.associate = (models) => {
        Ingredient.belongsToMany(models.Recipe, {
            through: "RecipeIngredient",
            foreignKey: "ingredient_id",
        });
    };

    return Ingredient;
};
