const UserProfile = require("../../models/mongo/UserProfile");

const getNotificationData = async (msg, callback) => {
  UserProfile.findOne({ _id: msg.user_id })
    .populate("communityInvites.communityID")
    .then((result) => {
      let details = [];
      if (result !== null) {
        result.communityInvites.forEach((element) => {
          let inviteDetails = {
            communityName: element.communityID.communityName,
            communityID: element.communityID._id,
            time: element.dateTime,
          };
          details.push(inviteDetails);
        });
      }
      callback(null, details);
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.getNotificationData = getNotificationData;
