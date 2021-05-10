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
      UserProfile.find({ userIDSQL: msg.ID }).then((result, error) => {
        if (error) {
          res.data = userProfile;
          res.status = 500;
          callback(null, res);
        } else {
          if (result.length > 0) {
            redisClient.setex(msg.ID, 36000, JSON.stringify(result));
          }
          res.data = result;
          res.status = 200;
          callback(null, res);
        }
      });
    }
  });
};

exports.getUserProfile = getUserProfile;