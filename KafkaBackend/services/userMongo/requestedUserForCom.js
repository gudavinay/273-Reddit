const UserProfile = require("../../models/mongo/UserProfile");

const requestedUserForCom = async (msg, callback) => {
  await UserProfile.find({
    _id: { $in: msg.usersList },
  })
    .select({ userIDSQL: 1, name: 1, profile_picture_url: 1 })
    .then((result) => {
      let output = {};
      result.forEach((item) => {
        output[item._id] = {
          name: item.name,
          profile_picture_url: item.profile_picture_url,
        };
      });
      callback(null, output);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.requestedUserForCom = requestedUserForCom;
