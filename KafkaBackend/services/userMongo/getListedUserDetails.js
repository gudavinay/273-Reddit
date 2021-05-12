const UserProfile = require("../../models/mongo/UserProfile");

const getListedUserDetails = async (msg, callback) => {
  let skip = Number(msg.page) * Number(msg.size);
  let count = await UserProfile.countDocuments({
    $and: [
      { userIDSQL: { $in: msg.usersList } },
      { name: { $regex: msg.search, $options: "i" } },
    ],
  });
  await UserProfile.find({
    $and: [
      { userIDSQL: { $in: msg.usersList } },
      { name: { $regex: msg.search, $options: "i" } },
    ],
  })
    .select({ userIDSQL: 1, name: 1, profile_picture_url: 1 })
    .limit(Number(msg.size))
    .skip(skip)
    .sort({ name: 1 })
    .then((result) => {
      callback(null, { users: result, total: count });
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.getListedUserDetails = getListedUserDetails;
