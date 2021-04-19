module.exports = (sequelize, DataTypes) => {
    const Community = sequelize.define('Community', {
        community_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(150),
            allowNull: false,
        }
    });
    return Community;
}