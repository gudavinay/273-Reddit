const Community = require("../../models/mongo/Community");
const User = require("../../models/mongo/UserProfile");

const sendInvite = async (msg, callback) => {
  Community.findOneAndUpdate(
    { _id: msg.community_id },
    {
      $push: { sentInvitesTo: msg.members },
    },
    async (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        try {
          var r = await new Promise((resolve, reject) => {
            msg.members.forEach((user) => {
              User.findByIdAndUpdate(
                user.userID,
                {
                  $push: {
                    communityInvites: [
                      {
                        communityID: msg.community_id,
                        invitedBy: msg.invitedBy,
                      },
                    ],
                  },
                },
                (err, d) => {
                  if (err) {
                    reject(false);
                  }
                  resolve(true);
                }
              );
            });
          });
          if (r) {
            callback(null, "Invites Sent");
          }
        } catch (error) {
          callback(error, null);
        }
      }
    }
  );
};

exports.sendInvite = sendInvite;
