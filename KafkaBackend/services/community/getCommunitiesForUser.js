const Community = require("../../models/mongo/Community");

const getCommunitiesForUser = async (msg, callback) => {
  let res = {};
  Community.find({ "listOfUsers.userID": msg.query.ID })
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

exports.getCommunitiesForUser = getCommunitiesForUser;
