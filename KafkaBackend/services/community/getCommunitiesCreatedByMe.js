const Community = require("../../models/mongo/Community");

const getCommunitiesCreatedByMe = async (msg, callback) => {
  Community.find({ ownerID: msg.user_id }, (err, result) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      let communities = [];
      result.forEach((element) => {
        let communityDetails = {
          communityName: element.communityName,
          communityID: element._id,
        };
        communities.push(communityDetails);
      });
      callback(null, communities);
    }
  });
};

exports.getCommunitiesCreatedByMe = getCommunitiesCreatedByMe;
