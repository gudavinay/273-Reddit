const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");

const acceptInvite = async (msg, callback) => {
  console.log("Accept invite Kafka");
  UserProfile.findOneAndUpdate(
    { _id: msg.user_id },
    {
      $pull: { communityInvites: { communityID: msg.community_id } }
    },
    (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null);
      } else {
        Community.updateOne(
          {
            _id: msg.community_id,
            "sentInvitesTo.userID": msg.user_id
          },
          {
            $set: {
              "sentInvitesTo.$.isAccepted": 1,
              "sentInvitesTo.$.dateTime": Date.now
            }
          },
          (err, result) => {
            if (err) {
              console.log(err);
              callback(err, null);
            } else {
              Community.updateOne(
                { _id: msg.community_id },
                {
                  $push: {
                    listOfUsers: [{ userID: msg.user_id, isAccepted: 1 }]
                  }
                },
                (err, result) => {
                  if (err) {
                    console.log(err);
                    callback(err, null);
                  } else {
                    callback(null, "Accepted Invite");
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

exports.acceptInvite = acceptInvite;
