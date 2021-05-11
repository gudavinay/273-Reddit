const Vote = require("../../models/mongo/vote");

const vote = async (msg, callback) => {
    let res = {};
    if (msg.voteType == "U") {
        Comment.updateOne(
            { _id: msg.commentID },
            {
                $push: { upvotedBy: [{ userID: msg.user_id }] },
            },
            (err, result) => {
                if (err) {
                    res.status = 500;
                    callback(null, res);
                }
                res.data = result;
                res.status = 200;
                callback(null, res);
            }
        );
    } else if (msg.voteType == "D") {
        Comment.updateOne(
            { _id: msg.commentID },
            {
                $push: { downvotedBy: [{ userID: msg.user_id }] },
            },
            (err, result) => {
                if (err) {
                    res.status = 500;
                    callback(null, res);
                }
                res.data = result;
                res.status = 200;
                callback(null, res);
            }
        );
    }
};

exports.vote = vote;
