const express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const db = require("../../models/sql");
const UserProfile = require("../../models/mongo/UserProfile");
const Post = require("../../models/mongo/Post");

const mongoose = require("mongoose");
/* get all communities */
app.get("/getAllCommunities", async function (req, res, next) {
  try {
    const { sortKey, sortValue, limit, page, searchText } = req.query;

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
        $project: {
          communityName: "$communityName",
          communityDescription: "$communityDescription",
          ownerID: "$ownerID",
          imageURL: "$imageURL",
          createdAt: "$createdAt",
          postsLength: { $size: "$posts" },
          listOfUsersLength: { $size: "$listOfUsers" },
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

    const communitiesBySqlUserId = communities.docs.map(
      (c) => c.ownerID?.userIDSQL
    );

    const users = await db.User.findAll({
      where: {
        user_id: communitiesBySqlUserId,
      },
      attributes: ["user_id", "name", "email"],
    });

    const userById = users.reduce((acc, it) => {
      acc[it.user_id] = it;
      return acc;
    }, {});

    communities.docs = communities.docs.map((c) => {
      return {
        ...c,
        createdBy: userById[c.ownerID?.userIDSQL] || false,
      };
    });

    res.json({
      communities,
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
        user_id: user_id,
      },
      attributes: { exclude: ["password"] },
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

    let user_communities = await Community.aggregate([
      {
        $match: {
          listOfUsers: {
            $elemMatch: { userID: mongoUser._id, isAccepted: true },
          },
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
        $project: {
          communityName: "$communityName",
          communityDescription: "$communityDescription",
          ownerID: "$ownerID",
          imageURL: "$imageURL",
          createdAt: "$createdAt",
          postsLength: { $size: "$posts" },
          listOfUsersLength: { $size: "$listOfUsers" },
          upVotedLength: "$upvoteCount",
          downVotedLength: "$downvoteCount",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    user_communities = await Community.populate(user_communities, "ownerID");

    const communitiesBySqlUserId = user_communities.map(
      (c) => c.ownerID?.userIDSQL
    );

    const users = await db.User.findAll({
      where: {
        user_id: communitiesBySqlUserId,
      },
      attributes: ["user_id", "name", "email"],
    });

    const userById = users.reduce((acc, it) => {
      acc[it.user_id] = it;
      return acc;
    }, {});

    user_communities = user_communities.map((c) => {
      return {
        ...c,
        createdBy: userById[c.ownerID?.userIDSQL] || false,
      };
    });

    res.json({
      user,
      // mongoUser,
      user_communities,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// app.post("/searchForPosts", (req, res) => {
//   console.log(req.body.search);
//   Post.aggregate([
//     {
//       $lookup: {
//         from: "communities",
//         localField: "communityID",
//         foreignField: "_id",
//         as: "communityDetails",
//       },
//     },
//     {
//       $lookup: {
//         from: "userprofiles",
//         localField: "userID",
//         foreignField: "_id",
//         as: "userDetails",
//       },
//     },
//     {
//       $match: {
//         $or: [
//           {
//             $and: [
//               { title: { $regex: req.body.search, $options: "i" } },
//               {
//                 $or: [
//                   {
//                     "communityDetails.ownerID": mongoose.Types.ObjectId(
//                       req.body.user_id
//                     ),
//                   },
//                   {
//                     "communityDetails.listOfUsers.userID": mongoose.Types.ObjectId(
//                       req.body.user_id
//                     ),
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             $and: [
//               { description: { $regex: req.body.search, $options: "i" } },
//               {
//                 $or: [
//                   {
//                     "communityDetails.ownerID": mongoose.Types.ObjectId(
//                       req.body.user_id
//                     ),
//                   },
//                   {
//                     "communityDetails.listOfUsers.userID": mongoose.Types.ObjectId(
//                       req.body.user_id
//                     ),
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         // communityName: { $regex: searchText, $options: "i" }
//       },
//     },
//     {
//       $unwind: {
//         path: "$userDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $unwind: {
//         path: "$communityDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $project: {
//         type: "$type",
//         title: "$title",
//         description: { $ifNull: ["$description", ""] },
//         link: { $ifNull: ["$link", ""] },
//         postImageUrl: { $ifNull: ["$postImageUrl", ""] },
//         upvotedBy: "$upvotedBy",
//         downvotedBy: "$downvotedBy",
//         createdAt: "$createdAt",
//         userMongoID: "$userDetails._id",
//         userSQLID: "$userDetails.userIDSQL",
//         userName: "$userDetails.name", // only if needed
//         communityName: "$communityDetails.communityName",
//         communityDescription: "$communityDetails.communityDescription",
//         imageURL: "$communityDetails.imageURL",
//       },
//     },
//   ]).then((result) => {
//     res.status(200).send(result);
//   });
// });
module.exports = router;
