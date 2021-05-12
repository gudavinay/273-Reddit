const db = require("../../models/sql");
const bcrypt = require("bcrypt");

const signUp = async (msg, callback) => {
  const salt = await bcrypt.genSalt(10);
  msg.password = await bcrypt.hash(msg.password, salt);
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
