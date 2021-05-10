const db = require("../../models/sql");

const sendMessage = async (msg, callback) => {
  db.Message.create({
    message: msg.message,
    sent_by: msg.sent_by,
    sent_to: msg.sent_to
  })
    .then(result => {
      callback(null, result);
    })
    .catch(error => {
      callback(error, null);
    });
};

exports.sendMessage = sendMessage;
