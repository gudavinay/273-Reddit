const redisClient = require("../../Util/redisConfig");
const UserProfile = require("../../models/mongo/UserProfile");

const getUserProfile = async (msg, callback) => {
  let res = {};
  redisClient.get(msg.ID, async (err, userProfile) => {
    if (userProfile) {
      res.data = userProfile;
      res.status = 200;
      callback(null, res);
    } else {
      UserProfile.find({ userIDSQL: msg.ID })
        .then(result => {
          if (result.length > 0) {
            redisClient.setex(msg.ID, 36000, JSON.stringify(result));
          }
          res.data = result;
          res.status = 200;
          callback(null, res);
        })
        .catch(err => {
          res.data = err;
          res.status = 500;
          callback(null, res);
        });
    }
  });
};

exports.getUserProfile = getUserProfile;
