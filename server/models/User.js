//const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        admin: {  
            type: DataTypes.TINYINT,  
            defaultValue: 0,  
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    User.associate = (models) => {
        User.hasMany(models.UserIngredient, {
            foreignKey: "user_id",
        });
    };

    return User;
};