const Community = require("../../models/mongo/Community");

const getUsersForCommunitiesForOwner = async (msg, callback) => {
  res = {};
  Community.find({
    ownerID: msg.ID
  })
    .populate("listOfUsers.userID")
    .then(result => {
      let output = new Set();
      result.forEach(item => {
        item.listOfUsers.forEach(temp => {
          if (temp.isAccepted) {
            output.add(Number(temp.userID.userIDSQL));
          }
        });
      });
      res.data = Array.from(output);
      res.status = 200;
      callback(null, res);
    }).catch(err => {
      res.status = 500;
      callback(null, res);
    })
};

exports.getUsersForCommunitiesForOwner = getUsersForCommunitiesForOwner;
