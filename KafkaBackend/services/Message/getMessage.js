const db = require("../../models/sql");
const { Op } = require("sequelize");

const getMessage = async (msg, callback) => {
  await db.Message.findAll({
    where: {
      [Op.or]: [
        { sent_by: msg.ID, sent_to: msg.chatWith },
        { sent_by: msg.chatWith, sent_to: msg.ID }
      ]
    },
    order: [["createdAt", "ASC"]]
  })
    .then(message => {
      callback(null, message);
    })
    .catch(error => {
      callback(error, null);
    });
};

exports.getMessage = getMessage;
