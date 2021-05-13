const db = require("../../models/sql");
const bcrypt = require("bcrypt");

const login = async (msg, callback) => {
  db.User.findOne({
    where: {
      email: msg.email
    }
  })
    .then(user => {
      if (user === null) {
        callback(null, "User not found");
      } else {
        bcrypt.compare(
          msg.password,
          user.password,
          function (err, matchPassword) {
            if (err) callback("Username or password mismatch", null);
            if (matchPassword) {
              callback(null, user);
            } else {
              callback(err, "Username or password mismatch");
            }
          }
        );
      }
    })
    .catch(err => {
      callback(err, "UnSuccessful Login");
    });
};

exports.login = login;
