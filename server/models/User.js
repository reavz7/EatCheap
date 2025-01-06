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
        }   
    }, {
        timestamps: false,
       
    });

    User.associate = (models) => {
        User.hasOne(models.Budget, {
            foreignKey: "user_id",
        });
        User.hasMany(models.UserIngredient, {
            foreignKey: "user_id",
        });
    };

     // Przy tworzeniu usera tworze mu od razu budzet aby nie musial on tego robic pozniej sam,
     //zatem budzet bedzie juz tylko aktualizowany od tego momentu przez samego uzytkownika
     User.afterCreate(async (user) => {
        const { Budget } = sequelize.models; 
        await Budget.create({
            user_id: user.id,
            amount: 0, 
        });
    });
    return User;
};
