const UserProfile = require("../../models/mongo/UserProfile");

const createUser = async (msg, callback) => {
  let userProfile = new UserProfile({
    userIDSQL: msg.sqlUserID,
    name: msg.name,
    email: msg.email
  });
  userProfile.save((err, result) => {
    if (result) {
      callback(null, result);
    } else callback(err, null);
  });
};

exports.createUser = createUser;
