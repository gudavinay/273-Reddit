const db = require("../../models/sql");
const { Op } = require("sequelize");

const getUsersChattedInfo = async (msg, callback) => {
  await db.Message.findAll({
    attributes: ["sent_by", "sent_to"],
    group: ["sent_by", "sent_to"],
    where: {
      [Op.or]: [{ sent_by: msg.ID }, { sent_to: msg.ID }]
    },
    include: [
      {
        model: db.User,
        as: "sentByUser",
        attributes: ["user_id", "name", "email", "profile_picture_url"]
      },
      {
        model: db.User,
        as: "sentToUser",
        attributes: ["user_id", "name", "email", "profile_picture_url"]
      }
    ]
  })
    .then(users => {
      callback(null, users);
    })
    .catch(error => {
      callback(error, null);
    });
};

exports.getUsersChattedInfo = getUsersChattedInfo;
