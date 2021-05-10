const db = require("../../models/sql");
const { Op } = require("sequelize");

const searchUser = async (msg, callback) => {
  await db.User.findAll({
    attributes: ["user_id", "name"],
    where: {
      name: {
        [Op.startsWith]: msg.name
      }
    }
  })
    .then(message => {
      callback(null, message);
    })
    .catch(error => {
      callback(error, null);
    });
};

exports.searchUser = searchUser;
