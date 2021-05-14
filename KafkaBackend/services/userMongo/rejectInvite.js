const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");

const rejectInvite = async (msg, callback) => {
  UserProfile.findOneAndUpdate(
    { _id: msg.user_id },
    {
      $pull: { communityInvites: { communityID: msg.community_id } }
    },
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        Community.updateOne(
          {
            _id: msg.community_id,
            "sentInvitesTo.userID": msg.user_id
          },
          {
            $set: {
              "sentInvitesTo.$.isAccepted": -1,
              "sentInvitesTo.$.dateTime": Date.now
            }
          },
          (err, result) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, result);
            }
          }
        );
      }
    }
  );
};

exports.rejectInvite = rejectInvite;
