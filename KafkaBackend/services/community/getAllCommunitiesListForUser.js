const Community = require("../../models/mongo/Community");

// this is used in home page to show all communities the user is part of ( WIDGET )
const getAllCommunitiesListForUser = async (msg, callback) => {
  let res = {};
  Community.find({
    $or: [
      { $and: [{ 'listOfUsers.userID': msg.query.ID }, { 'listOfUsers.isAccepted': 1 }] },
      { 'ownerID': msg.query.ID }
    ]
  })
    .then((result) => {
      callback(null, result);
    })
    .catch((err) => {
      res.status = 400;
      callback(null, res);
    });
};

exports.getAllCommunitiesListForUser = getAllCommunitiesListForUser;
