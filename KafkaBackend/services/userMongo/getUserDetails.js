const mongoose = require("mongoose");
const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");

const getUserDetailsById = async (msg, callback) => {
    try {
        const { user_id, loggedInUserId } = msg;

        const loggedInUser = await UserProfile.findOne({
            userIDSQL: loggedInUserId,
        });

        const user = await UserProfile.findOne({
            userIDSQL: user_id,
        });
        if (!user) {
            throw new Error(`User Not Found`);
        }

        let user_communities = await Community.aggregate([
            {
                $match: {
                    $or: [
                        {
                            listOfUsers: {
                                $elemMatch: { userID: user._id, isAccepted: true },
                            },
                        },
                        {
                            ownerID: mongoose.Types.ObjectId(
                                user._id
                            )
                        }
                    ]
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "communityID",
                    as: "posts",
                },
            },
            {
                "$addFields": {
                    "listOfUsersLength": {
                        "$reduce": {
                            "input": "$listOfUsers",
                            "initialValue": 0,
                            "in": { "$add": ["$$value", "$$this.isAccepted"] }
                        }
                    }
                }
            },
            {
                $project: {
                    communityName: "$communityName",
                    communityDescription: "$communityDescription",
                    ownerID: "$ownerID",
                    imageURL: "$imageURL",
                    createdAt: "$createdAt",
                    postsLength: { $size: "$posts" },
                    listOfUsersLength: { "$add": ["$listOfUsersLength", 1] }, // Adding +1 means Owner
                    upVotedLength: { $size: "$upvotedBy" },
                    downVotedLength: { $size: "$downvotedBy" },
                    score: {
                        $subtract: [{ $size: "$upvotedBy" }, { $size: "$downvotedBy" }],
                    },
                    userVoteDir: {
                        $cond: {
                            if: {
                                $setIsSubset: [
                                    [{ _id: mongoose.Types.ObjectId(loggedInUser._id) }],
                                    "$upvotedBy",
                                ],
                            },
                            then: 1,
                            else: {
                                $cond: {
                                    if: {
                                        $setIsSubset: [
                                            [{ _id: mongoose.Types.ObjectId(loggedInUser._id) }],
                                            "$downvotedBy",
                                        ],
                                    },
                                    then: -1,
                                    else: 0,
                                },
                            },
                        },
                    }
                },
            },
            { $sort: { createdAt: -1 } },
        ]);

        user_communities = await Community.populate(user_communities, "ownerID");

        callback(null, {
            status: 200, data: {
                user,
                user_communities,
            }
        });
    } catch (e) {
        callback(e, { status: 500, message: e.message });
    }
}

exports.getUserDetailsById = getUserDetailsById;
