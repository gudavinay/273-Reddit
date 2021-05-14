const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Promise = require("bluebird");

const removeUserFromCommunities = async (msg, callback) => {
  let res = {};
  console.log("********************");
  console.log(msg);
  console.log("********************");
  try {
    Promise.mapSeries(msg.commList, (item) => {
      return Community.findOneAndUpdate(
        {
          _id: item,
        },
        {
          $pull: {
            listOfUsers: { userID: msg.userID },
            sentInvitesTo: { userID: msg.userID },
          },
        },
        { useFindAndModify: false }
      );
    }).then(async () => {
      console.log("user deleted from com");
      await Post.deleteMany({
        communityID: { $in: msg.commList },
        userID: msg.userID,
      });
      await Comment.deleteMany({
        communityID: { $in: msg.commList },
        userID: msg.userID,
      });
      res.status = 200;
      callback(null, res);
    });
  } catch (err) {
    res.status = 400;
    callback(null, res);
  }
};

exports.removeUserFromCommunities = removeUserFromCommunities;
