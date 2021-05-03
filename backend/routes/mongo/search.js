const express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const db = require("../../models/sql");
const UserProfile = require("../../models/mongo/UserProfile");

/* get all communities */
app.get("/getAllCommunities", async function (req, res, next) {
    try {
        const { sortKey, sortValue, limit, page, searchText } = req.query;

        const aggregate = Community.aggregate([
            {
                "$match": {
                    "communityName": { $regex: searchText, $options: "i" }
                }
            },
            {
                $lookup:
                {
                    from: "votes",
                    localField: "_id",
                    foreignField: "entityId",
                    as: "vote"
                }
            },
            { '$unwind': { 'path': '$vote', 'preserveNullAndEmptyArrays': true } },
            {
                $group: {
                    _id: "$_id",
                    communityName: { "$first": "$communityName" },
                    communityDescription: { "$first": "$communityDescription" },
                    ownerID: { "$first": "$ownerID" },
                    imageURL: { "$first": "$imageURL" },
                    createdAt: { "$first": "$createdAt" },
                    posts: { "$first": "$posts" },
                    listOfUsers: { "$first": "$listOfUsers" },
                    upvoteCount: {
                        $sum: { $cond: { if: { $eq: ["$vote.voteDir", 1] }, then: 1, else: 0 } },
                    },
                    downvoteCount: {
                        $sum: {
                            $cond: { if: { $eq: ["$vote.voteDir", -1] }, then: 1, else: 0 },
                        },
                    },
                },
            },
            {
                $lookup:
                {
                    from: "posts",
                    localField: "_id",
                    foreignField: "communityID",
                    as: "posts"
                }
            },
            {
                "$project": {
                    "communityName": "$communityName",
                    "communityDescription": "$communityDescription",
                    "ownerID": "$ownerID",
                    "imageURL": "$imageURL",
                    "createdAt": "$createdAt",
                    "postsLength": { "$size": "$posts" },
                    "listOfUsersLength": { "$size": "$listOfUsers" },
                    "upVotedLength": "$upvoteCount",
                    "downVotedLength": "$downvoteCount"
                }
            },
            { "$sort": { [sortKey]: sortValue.toLowerCase() === "desc" ? -1 : 1, "_id": -1 } }
        ]);

        const communities = await Community.aggregatePaginate(aggregate, {
            page, limit
        });

        communities.docs = await Community.populate(communities.docs, "ownerID");

        const communitiesBySqlUserId = communities.docs.map(c => c.ownerID?.userIDSQL);

        const users = await db.User.findAll({
            where: {
                user_id: communitiesBySqlUserId
            },
            attributes: ['user_id', 'name', "email"]
        });

        const userById = users.reduce((acc, it) => {
            acc[it.user_id] = it;
            return acc;
        }, {});

        communities.docs = communities.docs.map(c => {
            return {
                ...c,
                createdBy: userById[c.ownerID?.userIDSQL] || false
            }
        });

        res.json({
            communities
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/* get Specific user profile data */
app.get("/getUserProfile/:user_id", async function (req, res, next) {
    try {
        const { user_id } = req.params;

        const user = await db.User.findOne({
            where: {
                user_id: user_id
            }
        });
        if (!user) {
            throw new Error(`User Not Found`);
        }

        const mongoUser = await UserProfile.findOne({
            userIDSQL: user_id,
        });
        if (!mongoUser) {
            throw new Error(`Mongo User Not Found`);
        }

        const user_communities = await Community.find({
            listOfUsers: {
                $elemMatch: { userID: mongoUser._id, isAccepted: true },
            },
        });

        res.json({
            user,
            // mongoUser,
            user_communities
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;