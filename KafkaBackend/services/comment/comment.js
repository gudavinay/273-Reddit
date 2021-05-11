const Comment = require("../../models/mongo/Comment");

const comment = async (msg, callback) => {

    let comment = {}, res = {};
    if (msg.isParentComment) {
        comment = {
            postID: msg.postID,
            description: msg.description,
            isParentComment: msg.isParentComment,
            userID: msg.userID,
        };
        new Comment(comment).save((err, result) => {
            if (err) {
                res.status = 500;
                callback(null, res);
            }
            res.data = result;
            res.status = 200;
            callback(null, res);
        });
    } else {
        comment = {
            postID: msg.postID,
            description: msg.description,
            isParentComment: msg.isParentComment,
            userID: msg.userID,
            parentCommentID: msg.parentCommentID,
        };
        new Comment(comment).save((err, result) => {
            if (err) {
                res.status = 500;
                callback(null, res);
            }
            res.data = result;
            res.status = 200;
            callback(null, res);
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
