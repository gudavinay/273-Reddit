const Community = require("../../../models/mongo/Community");

const postUserAnalytics = async (msg, callback) => {
  let data = [];
  Community.find({ ownerID: msg.ID }).then((result, error) => {
    if (error) {
      callback(error, null);
    } else {
      const findResult = JSON.parse(JSON.stringify(result));
      findResult.map(community => {
        Post.find({ communityID: community._id }).then((postResult, error) => {
          data.push({
            _id: community._id,
            listOfUsers: community.listOfUsers,
            count: postResult.length,
            name: community.communityName
          });
          console.log(JSON.stringify(data));
          if (result.length == data.length) {
            callback(null, data);
          }
        });
      });
    }
  });
};

exports.postUserAnalytics = postUserAnalytics;
