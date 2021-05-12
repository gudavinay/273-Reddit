const db = require("../../models/sql");
const bcrypt = require("bcrypt");

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
        bcrypt.compare(
          msg.password,
          user.password,
          function (err, matchPassword) {
            if (err) return error;
            if (matchPassword) {
              user.password = "";
              res.status = 200;
              res.data = user;
              callback(null, res);
            } else {
              res.status = 401;
              callback(null, res);
            }
          }
        );
      }
    })
    .catch(err => {
      res.status = 500;
      callback(null, res);
    });
};

exports.login = login;
