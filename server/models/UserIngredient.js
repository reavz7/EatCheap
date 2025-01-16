module.exports = (sequelize, DataTypes) => {
    const UserIngredient = sequelize.define("UserIngredient", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
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

    UserIngredient.associate = (models) => {
        UserIngredient.belongsTo(models.Ingredient, {
            foreignKey: "ingredient_id",
            as: "ingredient",
        });
    };

    return UserIngredient;
};