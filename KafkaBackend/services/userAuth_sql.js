const db = require("./../models/sql");
const bcrypt = require("bcrypt");
const { secret } = require("./../Util/config");
const { auth } = require("./../Util/passport");
const jwt = require("jsonwebtoken");
auth();

const login = async (msg, callback) => {
  res = {};
  db.User.findOne({
    where: {
      email: msg.email,
    },
  })
    .then((user) => {
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
              //   console.log("here");
              user.password = "";
              const userLogin = {
                userID: user,
                token: createToken(user),
              };
              res.status = 200;
              res.data = JSON.stringify(userLogin);
              callback(null, res);
            } else {
              res.status = 401;
              callback(null, res);
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status = 500;
      callback(null, res);
    });
};

function createToken(user) {
  const payload = { id: user.user_id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000,
  });
  return "JWT " + token;
}

handle_request = (msg, callback) => {
  if (msg.path === "Login") {
    login(msg, callback);
  }
};

exports.handle_request = handle_request;
