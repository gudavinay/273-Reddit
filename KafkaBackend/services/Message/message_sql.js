const db = require("../../models/sql");
const { Op } = require("sequelize");

const getMessageForTest = async (msg, callback) => {
  res = {};
  const getMessage = await db.Message.findAll({ where: { sent_by: 53 } });
  //   console.log(getMessage);
  if (getMessage.length > 0) {
    res.status = 200;
    console.log(getMessage.length);
    // res.data = JSON.stringify(getMessage);
    callback(null, res);
  } else {
    res.status = 500;
    callback(null, res);
  }
};

// const getUsersChattedInfo = async (msg, callback) => {
//   await db.Message.findAll({
//     attributes: ["sent_by", "sent_to"],
//     group: ["sent_by", "sent_to"],
//     where: {
//       [Op.or]: [{ sent_by: msg.ID }, { sent_to: msg.ID }]
//     },
//     include: [
//       {
//         model: db.User,
//         as: "sentByUser",
//         attributes: ["user_id", "name", "email", "profile_picture_url"]
//       },
//       {
//         model: db.User,
//         as: "sentToUser",
//         attributes: ["user_id", "name", "email", "profile_picture_url"]
//       }
//     ]
//   })
//     .then(users => {
//       callback(null, users);
//     })
//     .catch(error => {
//       callback(error, null);
//     });
// };

// const sendMessage = async (msg, callback) => {
//   try {
//     let message = await db.Message.create({
//       message: msg.message,
//       sent_by: msg.sent_by,
//       sent_to: msg.sent_to
//     });
//     callback(null, message);
//   } catch (error) {
//     callback(error, null);
//   }
// };

exports.getMessageForTest = getMessageForTest;
