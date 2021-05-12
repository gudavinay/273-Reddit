const Community = require("../../../models/mongo/Community");

const uniqueCommunity = async (msg, callback) => {
  await Community.find({
    communityName: msg.communityName
  })
    .then(result => {
      if (result.length > 0) {
        callback("Community is registered", null);
      } else {
        callback(null, result);
      }
    })
    .catch(err => {
      callback(err, null);
    });
};

exports.uniqueCommunity = uniqueCommunity;
