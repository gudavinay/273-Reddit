const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Promise = require("bluebird");

const removeUserFromCommunities = async (msg, callback) => {
  let res = {};
  try {
    Promise.mapSeries(msg.body.commList, (item) => {
      return Community.findOneAndUpdate(
        {
          _id: item,
        },
        { $pull: { listOfUsers: { userID: msg.body.userID } } },
        { useFindAndModify: false }
      );
    }).then(async () => {
      await Post.deleteMany({
        communityID: { $in: msg.body.commList },
        userID: msg.body.userID,
      });
      await Comment.deleteMany({
        communityID: { $in: msg.body.commList },
        userID: msg.body.userID,
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
