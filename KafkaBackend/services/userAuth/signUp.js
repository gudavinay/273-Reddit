const db = require("../../models/sql");
const passwordHash = require('password-hash');

const signUp = async (msg, callback) => {
  msg.password = passwordHash.generate(msg.password)
  db.User.create({
    email: msg.email,
    password: msg.password,
    name: msg.name
  })
    .then(user => {
      callback(null, user);
    })
    .catch(err => {
      callback(err, null);
    });
};

exports.signUp = signUp;
