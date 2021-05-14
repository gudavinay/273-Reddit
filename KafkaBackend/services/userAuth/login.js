const db = require("../../models/sql");
const passwordHash = require('password-hash');

const login = async (msg, callback) => {
  res = {};
  db.User.findOne({
    where: {
      email: msg.email
    }
  })
    .then(user => {
      if (user === null) {
        res.status = 404;
        callback(null, res);
      } else {
        if (passwordHash.verify(msg.password, user.password)) {
          user.password = "";
          res.status = 200;
          res.data = user;
          callback(null, res);
        } else {
          res.status = 401;
          callback(null, res);
        };
      }
    })
    .catch(err => {
      res.status = 500;
      callback(null, res);
    });
};

exports.login = login;
