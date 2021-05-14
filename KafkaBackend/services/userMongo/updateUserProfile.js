const UserProfile = require("../../models/mongo/UserProfile");
const redisClient = require("../../Util/redisConfig");
const db = require("../../models/sql");
const passwordHash = require('password-hash');

const updateUserProfile = async (msg, callback) => {
  if (msg.password) {
    UserProfile.findOneAndUpdate({ _id: msg.id }, { $set: msg }, { new: true })
      .then(result => {
        db.User.update(
          { email: msg.email, name: msg.name, password: passwordHash.generate(msg.password) },
          { where: { user_id: msg.userIDSQL } }
        )
          .then(sqlResult => {
            redisClient.setex(msg.userIDSQL, 36000, JSON.stringify(result));
            callback(null, result);
          })
          .catch(err => {
            callback(err, null);
          });
      })
      .catch(err => {
        callback(err, null);
      });
  } else {
    UserProfile.findOneAndUpdate({ _id: msg.id }, { $set: msg }, { new: true })
      .then(result => {
        db.User.update(
          { email: msg.email, name: msg.name },
          { where: { user_id: msg.userIDSQL } }
        )
          .then(sqlResult => {
            redisClient.setex(msg.userIDSQL, 36000, JSON.stringify(result));
            callback(null, result);
          })
          .catch(err => {
            callback(err, null);
          });
      })
      .catch(err => {
        callback(err, null);
      });
  }



};

exports.updateUserProfile = updateUserProfile;
