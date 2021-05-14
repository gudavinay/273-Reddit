const Community = require("../../models/mongo/Community");

const getCommunitiesForUserPartOfOwnerCommunity = async (msg, callback) => {
  let res = {};
  Community.find({
    "listOfUsers.userID": msg.query.userID,
    "listOfUsers.isAccepted": 1,
    ownerID: msg.query.ownerID,
  })
    .then((result) => {
      res.status = 200;
      res.data = result;
      callback(null, res);
    })
    .catch((err) => {
      res.status = 400;
      callback(null, res);
    });
};

exports.getCommunitiesForUserPartOfOwnerCommunity =
  getCommunitiesForUserPartOfOwnerCommunity;
