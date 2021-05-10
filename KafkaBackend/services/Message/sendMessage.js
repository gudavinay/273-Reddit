const db = require("../../models/sql");

const sendMessage = async (msg, callback) => {
  try {
    let message = await db.Message.create({
      message: msg.message,
      sent_by: msg.sent_by,
      sent_to: msg.sent_to
    });
    callback(null, message);
  } catch (error) {
    callback(error, null);
  }
};

exports.sendMessage = sendMessage;
