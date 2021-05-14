const UserProfile = require("../../models/mongo/UserProfile");
const redisClient = require("../../Util/redisConfig");
const db = require("../../models/sql");

const updateUserProfile = async (msg, callback) => {
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
};

exports.updateUserProfile = updateUserProfile;
