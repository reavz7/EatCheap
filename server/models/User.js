const bcrypt = require('bcrypt');

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
            type: DataTypes.STRING(255),
            allowNull: false,
        }   
    }, {
        timestamps: false,
        hooks: {
            beforeCreate: async (user, options) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    });

    User.associate = (models) => {
        User.hasOne(models.Budget, {
            foreignKey: "user_id",
        });
        User.hasMany(models.UserIngredient, {
            foreignKey: "user_id",
        });
    };

    return User;
};