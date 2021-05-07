const db = require("../models/sql");

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

handle_request = (msg, callback) => {
  if (msg.path === "Get-Message-For-Test") {
    getMessageForTest(msg, callback);
  }
};

exports.handle_request = handle_request;
