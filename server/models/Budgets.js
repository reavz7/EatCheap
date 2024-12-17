module.exports = (sequelize, DataTypes) => {
    const Budgets = sequelize.define("Budgets", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    Budgets.associate = (models) => {
        Budgets.belongsTo(models.Users, {
            foreignKey: "userId",
        });
    };

    return Budgets;
};
