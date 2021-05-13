const Community = require("../../models/mongo/Community");
const Promise = require("bluebird");

const rejectUsersForCommunity = async (msg, callback) => {
  let res = {};
  try {
    Promise.mapSeries(msg.userList, (item) => {
      return Community.findOneAndUpdate(
        {
          _id: msg.communityID,
          "listOfUsers.userID": item,
        },
        { $set: { "listOfUsers.$.isAccepted": -1 } }
      );
    }).then(async () => {
      res.status = 200;
      callback(null, res);
    });
  } catch (err) {
    res.status = 400;
    callback(null, res);
  }
};

exports.rejectUsersForCommunity = rejectUsersForCommunity;
