const Post = require("../../models/mongo/Post");
const Vote = require("../../models/mongo/vote")
const mongoose = require('mongoose');

const getPostsInCommunity = async (msg, callback) => {
    let res = {};
    console.log("msg.query posts = ", msg.query);
    const userId = msg.query.userId;
    Post.aggregate([
        {
            $match: {
                communityID: mongoose.Types.ObjectId(msg.query.ID),
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "postID",
                as: "commentsDetails",
            },
        },
        {
            $lookup: {
                from: "userprofiles",
                localField: "userID",
                foreignField: "_id",
                as: "userDetails",
            },
        },
    ])
        // Post.find({ communityID: mongoose.Types.ObjectId(msg.query.ID) })
        // .populate("userID")
        .then((result) => {
            console.log("results in posts community = ", result);
            const responseData = JSON.parse(JSON.stringify(result));
            if (responseData && responseData.length > 0) {
                responseData.forEach((resp, index) => {
                    const entityId = resp._id;
                    console.log("searching for ", entityId);
                    Vote.aggregate(
                        [
                            {
                                $match: {
                                    entityId: mongoose.Types.ObjectId(entityId),
                                },
                            },

                            {
                                $group: {
                                    _id: "$entityId",
                                    upvoteCount: {
                                        $sum: {
                                            $sum: {
                                                $cond: {
                                                    if: { $eq: ["$voteDir", 1] },
                                                    then: 1,
                                                    else: 0,
                                                },
                                            },
                                        },
                                    },
                                    downvoteCount: {
                                        $sum: {
                                            $cond: {
                                                if: { $eq: ["$voteDir", -1] },
                                                then: 1,
                                                else: 0,
                                            },
                                        },
                                    },
                                    userVoteDir: {
                                        $sum: {
                                            $cond: {
                                                if: {
                                                    $eq: ["$userId", mongoose.Types.ObjectId(userId)],
                                                },
                                                then: {
                                                    $cond: {
                                                        if: {
                                                            $eq: ["$voteDir", -1],
                                                        },
                                                        then: -1,
                                                        else: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: ["$voteDir", 1],
                                                                },
                                                                then: 1,
                                                                else: 0,
                                                            },
                                                        },
                                                    },
                                                },
                                                else: 0,
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                        (err, result) => {
                            console.log("result c = ", result);
                            if (err) {
                                console.log("error = ", err);
                                res.status = 500;
                                callback(null, res);
                            } else {
                                resp.score =
                                    resp.upvoteCount =
                                    resp.downvoteCount =
                                    resp.userVoteDir =
                                    0;
                                if (result && result[0]) {
                                    resp.score = result[0].upvoteCount - result[0].downvoteCount;
                                    resp.upvoteCount = result[0].upvoteCount;
                                    resp.downvoteCount = result[0].downvoteCount;
                                    console.log("resp userDetails = ", resp.userDetails[0]);
                                    resp.userID = resp.userDetails[0];
                                    resp.commentsCount = resp.commentsDetails.length;
                                    delete resp.userDetails;
                                    delete resp.commentDetails;
                                    // resp.userVoteDir = result[0].userVoteDir;
                                } else {
                                    resp.score = 0;
                                    resp.upvoteCount = 0;
                                    resp.downvoteCount = 0;
                                    // console.log("resp userDetails = ", resp.userDetails[0]);
                                    resp.userID = resp.userDetails[0];
                                    resp.commentsCount = resp.commentsDetails.length;
                                    delete resp.userDetails;
                                    delete resp.commentDetails;
                                }
                            }
                            if (index == responseData.length - 1) {
                                console.log("response data = ", responseData);
                                res.data = responseData;
                                res.status = 200;
                                callback(null, res);
                            }
                        }
                    );
                });
            } else {
                res.data = responseData;
                res.status = 200;
                callback(null, res);
            }
            // res.status(200).send(result);
        })
        .catch((err) => {
            console.log("err - ", err);
            res.status = 500;
            callback(null, res);
        });
};

exports.getPostsInCommunity = getPostsInCommunity;