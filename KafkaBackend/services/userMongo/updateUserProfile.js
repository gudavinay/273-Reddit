const UserProfile = require("../../models/mongo/UserProfile");

const updateUserProfile = async (msg, callback) => {
  UserProfile.findOneAndUpdate({ _id: msg.id }, { $set: msg }, { new: true })
    .then(result => {
      callback(null, result);
    })
    .catch(err => {
      callback(err, null);
    });
};

exports.updateUserProfile = updateUserProfile;
