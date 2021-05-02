module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "sent_by"
      }
    }),
      Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: "sent_to"
        }
      });
  };

  return Message;
};
