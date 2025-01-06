module.exports = (sequelize, DataTypes) => {
    const Budget = sequelize.define("Budget", {
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
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });
    
    return Budget;
};
