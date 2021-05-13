const Post = require("../../models/mongo/Post");

const mongoose = require("mongoose");

const searchPost = async (msg, callback) => {
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
            $and: [
              { title: { $regex: msg.search, $options: "i" } },
              {
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
            ],
          },
          {
            $and: [
              { description: { $regex: msg.search, $options: "i" } },
              {
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
            ],
          },
        ],
        // communityName: { $regex: searchText, $options: "i" }
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
      callback(null, result);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.searchPost = searchPost;
