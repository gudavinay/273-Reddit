const mongoose = require("mongoose");
const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");

const getUserDetailsById = async (msg, callback) => {
    try {
        const { user_id } = msg;

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
                    from: "votes",
                    localField: "_id",
                    foreignField: "entityId",
                    as: "vote",
                },
            },
            { $unwind: { path: "$vote", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    communityName: { $first: "$communityName" },
                    communityDescription: { $first: "$communityDescription" },
                    ownerID: { $first: "$ownerID" },
                    imageURL: { $first: "$imageURL" },
                    createdAt: { $first: "$createdAt" },
                    posts: { $first: "$posts" },
                    listOfUsers: { $first: "$listOfUsers" },
                    upvoteCount: {
                        $sum: {
                            $cond: { if: { $eq: ["$vote.voteDir", 1] }, then: 1, else: 0 },
                        },
                    },
                    downvoteCount: {
                        $sum: {
                            $cond: { if: { $eq: ["$vote.voteDir", -1] }, then: 1, else: 0 },
                        },
                    },
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
                    // listOfUsers: "$listOfUsers",
                    listOfUsersLength: { "$add": ["$listOfUsersLength", 1] }, // Adding +1 means Owner
                    upVotedLength: "$upvoteCount",
                    downVotedLength: "$downvoteCount",
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
