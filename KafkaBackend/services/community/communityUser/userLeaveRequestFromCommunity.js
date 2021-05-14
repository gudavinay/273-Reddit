const Community = require("../../../models/mongo/Community");

const userLeaveRequestFromCommunity = async (msg, callback) => {
  Community.findOneAndUpdate(
    { _id: msg.community_id },
    {
      $pull: {
        listOfUsers: { userID: msg.user_id },
        sentInvitesTo: { userID: msg.user_id }
      }
    },
    {
      new: true
    })
    .populate("listOfUsers.userID")
    .then(result => {
      callback(null, result);
    }).catch(err => {
      callback(err, null);
    });
};

exports.userLeaveRequestFromCommunity = userLeaveRequestFromCommunity;
