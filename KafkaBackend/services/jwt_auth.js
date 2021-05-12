const db = require("./../models/sql");

const jwtAuthHandler = async (msg, callback) => {
  res = {};
  try {
    console.log(msg, "msg");
    db.User.findOne({ where: { user_id: msg.user_id } }).then(result => {
      res.status = 200;
      res.data = result;
      callback(null, res);
    }).catch(err => {
      res.status = 404;
      res.data = err;
      callback(null, res);
    });
  } catch (err) {
    res.status = 500;
    callback(null, res);
  }
};

handle_request = (msg, callback) => {
  if (msg.path === "jwt-auth") {
    jwtAuthHandler(msg, callback);
  }
};

exports.handle_request = handle_request;
