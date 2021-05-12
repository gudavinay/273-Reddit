const Community = require("../../../models/mongo/Community");

const postUserAnalytics = async (msg, callback) => {
  Community.find({ ownerID: msg.ID }).then((result, error) => {
    if (error) {
      callback(error, null);
    } else {
      let output = [];
      result.forEach(item => {
        let acceptedIdOfSQL = [];
        for (let i = 0; i < item.listOfUsers.length; i++) {
          if (item.listOfUsers[i].isAccepted)
            acceptedIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
        }
        let data = JSON.parse(JSON.stringify(item));
        data.acceptedUsersSQLIds = acceptedIdOfSQL;
        data.NoOfPost = item.NoOfPost;
        data.communityName = item.communityName;
        data.communityID = item._id;
        output.push(data);
      });
      callback(null, output);
    }
  });
};

exports.postUserAnalytics = postUserAnalytics;
