const Comment = require("../../models/mongo/Comment");
const Post = require("../../models/mongo/Post");

const comment = async (msg, callback) => {
  console.log(msg);
  let comment = {},
    res = {};
  if (msg.isParentComment) {
    comment = {
      postID: msg.postID,
      description: msg.description,
      isParentComment: msg.isParentComment,
      userID: msg.userID,
      communityID: msg.communityID,
    };
    console.log(comment);
    new Comment(comment).save((err, result) => {
      if (err) {
        res.status = 500;
        callback(null, res);
      }
      Post.findOneAndUpdate(
        { _id: msg.postID },
        { $inc: { NoOfComments: 1 } }
      ).then((result) => {
        console.log("from comment " + result);
        res.data = result;
        res.status = 200;
        callback(null, res);
      });
    });
  } else {
    comment = {
      postID: msg.postID,
      description: msg.description,
      isParentComment: msg.isParentComment,
      userID: msg.userID,
      parentCommentID: msg.parentCommentID,
      communityID: msg.communityID,
    };
    new Comment(comment).save((err, result) => {
      if (err) {
        res.status = 500;
        callback(null, res);
      }
      Post.findOneAndUpdate(
        { _id: msg.postID },
        { $inc: { NoOfComments: 1 } }
      ).then((result) => {
        res.data = result;
        res.status = 200;
        callback(null, res);
      });
      // Comment.updateOne(
      //   { _id: msg.parentID },
      //   {
      //     $push: { subComment: [{ commentID: result._id }] },
      //   },
      //   (err, result) => {
      //     if (err) {
      //       res.status(500).send(err);
      //     }
      //     res.status(200).send(result);
      //   }
      // );
    });
  }
};

exports.comment = comment;
