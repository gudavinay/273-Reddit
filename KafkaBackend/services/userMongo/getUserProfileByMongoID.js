const UserProfile = require("../../models/mongo/UserProfile");

const getUserProfileByMongoID = async (msg, callback) => {
  UserProfile.findOne({ _id: msg.ID })
    .then((result) => {
      callback(null, result);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.getUserProfileByMongoID = getUserProfileByMongoID;
