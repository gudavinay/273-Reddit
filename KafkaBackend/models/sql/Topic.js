module.exports = (sequelize, DataTypes) => {
    const Topic = sequelize.define('Topic', {
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        topic: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        }
    });
    return Topic;
}