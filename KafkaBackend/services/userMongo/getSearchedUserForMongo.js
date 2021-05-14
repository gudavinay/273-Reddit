const UserProfile = require("../../models/mongo/UserProfile");

const getSearchedUserForMongo = async (msg, callback) => {
  if (msg.selectedUsers.length > 0) {
    msg.selectedUsers.forEach((user) => {
      msg.users.push(user.user_id);
    });
  }
  UserProfile.find(
    {
      _id: { $nin: msg.users },

      name: { $regex: msg.name, $options: "i" },
    },
    { name: 1, _id: 1 }
  )
    .limit(5)
    .then(async (result) => {
      callback(null, result);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.getSearchedUserForMongo = getSearchedUserForMongo;
