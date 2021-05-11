const Post = require("../../models/mongo/Post");
const mongoose = require('mongoose');

const getAllPostsWithUserId = async (msg, callback) => {
  let res = {};
  console.log(msg.user_id);
  Post.aggregate([
    {
      $lookup: {
        from: "communities",
        localField: "communityID",
        foreignField: "_id",
        as: "communityDetails",
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
    {
      $match: {
        $or: [
          {
            "communityDetails.ownerID": mongoose.Types.ObjectId(
              msg.user_id
            ),
          },
          {
            "communityDetails.listOfUsers": {
              $elemMatch: {
                userID: mongoose.Types.ObjectId(msg.user_id),
                isAccepted: 1,
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$communityDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        type: "$type",
        title: "$title",
        description: { $ifNull: ["$description", ""] },
        link: { $ifNull: ["$link", ""] },
        postImageUrl: { $ifNull: ["$postImageUrl", ""] },
        upvotedBy: "$upvotedBy",
        downvotedBy: "$downvotedBy",
        createdAt: "$createdAt",
        userMongoID: "$userDetails._id",
        userSQLID: "$userDetails.userIDSQL",
        userName: "$userDetails.name", // only if needed
        communityName: "$communityDetails.communityName",
        communityDescription: "$communityDetails.communityDescription",
        imageURL: "$communityDetails.imageURL",
      },
    },
  ])
    .then((result) => {
      res.data = result;
      res.status = 200;
      callback(null, res);
    })
    .catch((err) => {
      console.log(err);
      res.status = 500;
      callback(null, res);
    });
};

exports.getAllPostsWithUserId = getAllPostsWithUserId;