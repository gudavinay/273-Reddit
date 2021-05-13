const Community = require("./../models/mongo/Community");

const getAllCommunitiesSearch = async (msg, callback) => {
    try {
        const { sortKey, sortValue, limit, page, searchText } = msg;

        const aggregate = Community.aggregate([
            {
                $match: {
                    communityName: { $regex: searchText, $options: "i" },
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
            {
                $sort: {
                    [sortKey]: sortValue.toLowerCase() === "desc" ? -1 : 1,
                    _id: -1,
                },
            },
        ]);

        const communities = await Community.aggregatePaginate(aggregate, {
            page,
            limit,
        });

        communities.docs = await Community.populate(communities.docs, "ownerID");

        callback(null, {
            status: 200, data: {
                communities
            }
        });
    } catch (e) {
        callback(e, { status: 500, message: e.message });
    }
}

let handle_request = (msg, callback) => {
    switch (msg.path) {
        case "Get-All-Communities-Search":
            getAllCommunitiesSearch(msg, callback);
            break;
    }
};

exports.handle_request = handle_request;
