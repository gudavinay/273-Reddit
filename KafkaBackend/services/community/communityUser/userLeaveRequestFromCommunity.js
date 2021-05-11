const Community = require("../../../models/mongo/Community");

const userLeaveRequestFromCommunity = async (msg, callback) => {
  try {
    Community.findOneAndUpdate(
      { _id: msg.community_id },
      {
        $pull: { listOfUsers: { userID: msg.user_id } }
      },
      {
        new: true
      },
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, result);
        }
      }
    );
  } catch (err) {
    callback(err, null);
  }
};

exports.userLeaveRequestFromCommunity = userLeaveRequestFromCommunity;
