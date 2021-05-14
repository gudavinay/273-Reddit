const Community = require("../../models/mongo/Community");

const showInvitationStatus = async (msg, callback) => {
  let skip = 0;
  if (msg.page == 0) {
    skip = 0;
  } else {
    skip = msg.page * msg.size;
  }
  const limit = parseInt(msg.size);
  const recordCount = await new Promise((resolve, reject) => {
    Community.findOne({ _id: msg.community_id })
      .then((result) => {
        resolve(
          result && result.sentInvitesTo
            ? Object.keys(result.sentInvitesTo).length
            : 0
        );
      })
      .catch((err) => {
        callback(err, null);
      });
  });
  console.log(limit);
  console.log(msg.skip);

  Community.findOne(
    { _id: msg.community_id },
    { sentInvitesTo: { $slice: [skip, limit] } }
  )
    .populate("sentInvitesTo.userID", ["userIDSQL", "name"])
    .then(async (result) => {
      let data = {};
      data.sentInvitesTo = JSON.parse(JSON.stringify(result.sentInvitesTo));
      let users = [];

      result.sentInvitesTo.forEach((sentInvite) => {
        users.push(sentInvite.userID._id);
      });

      result.listOfUsers.forEach((user) => {
        users.push(user.userID._id);
      });

      data.listOfInvolvedUsers = users;
      data.totalRecords = recordCount;
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.showInvitationStatus = showInvitationStatus;
