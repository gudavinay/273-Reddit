const Community = require("../../models/mongo/Community");

const communityDetails = async (msg, callback) => {
  let res = {};
  c_id = msg.community_id;
  Community.find(
    {
      _id: c_id,
    },
    (err, result) => {
      if (err) {
        res.status = 500;
        callback(null, res);
      } else {
        let communityDetails = {
          communityName: result[0].communityName,
          communityDescription: result[0].communityDescription,
        };
        res.data = communityDetails;
        res.status = 200;
        callback(null, res);
      }
    }
  );
};

exports.communityDetails = communityDetails;
