module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(10),
        },
        location: {
            type: DataTypes.STRING(15),
        },
        bio: {
            type: DataTypes.STRING(150),
        },
        profile_picture_url: {
            type: DataTypes.STRING(80),
        }
    });

    User.associate = models => {
        User.hasMany(models.Message, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false,
                name: 'sent_by'
            }
        }),
        User.hasMany(models.Message, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false,
                name: 'sent_to'
            }
        })
    }

    return User;
}