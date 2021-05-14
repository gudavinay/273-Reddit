const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Promise = require("bluebird");

const removeUserFromCommunities = async (msg, callback) => {
  let res = {};
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
      let commentList = await Comment.find(
        {
          communityID: { $in: msg.commList },
          userID: msg.userID,
        },
        "_id"
      );
      let output = [];
      await Promise.all(
        commentList.map((item) => {
          output.push(item._id);
        })
      );
      let final_commentList = await Comment.find(
        {
          $or: [{ _id: { $in: output } }, { parentCommentID: { $in: output } }],
        },
        "_id postID communityID description"
      );
      await Promise.all(
        final_commentList.map(async (item) => {
          await Post.findOneAndUpdate(
            { _id: item.postID },
            { $inc: { NoOfComments: -1 } }
          );
          await Comment.findOneAndRemove({ _id: item._id });
        })
      );

      let postList = await Post.find(
        {
          communityID: { $in: msg.commList },
          userID: msg.userID,
        },
        "_id communityID title"
      );
      await Promise.all(
        postList.map(async (item) => {
          await Community.findOneAndUpdate(
            { _id: item.communityID },
            { $inc: { NoOfPost: -1 } }
          );
          await Post.findOneAndRemove({ _id: item._id });
          await Comment.deleteMany({ postID: item._id });
        })
      );
      res.status = 200;
      callback(null, res);
    });
  } catch (err) {
    res.status = 400;
    callback(null, res);
  }
};

exports.removeUserFromCommunities = removeUserFromCommunities;
