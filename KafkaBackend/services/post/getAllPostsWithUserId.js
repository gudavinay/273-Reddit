const Post = require("../../models/mongo/Post");
const Vote = require("../../models/mongo/vote");
const mongoose = require("mongoose");

// const getAllPostsWithUserId = async (msg, callback) => {
//   let res = {};
//   console.log(msg.user_id);
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
//             "communityDetails.ownerID": mongoose.Types.ObjectId(msg.user_id),
//           },
//           {
//             "communityDetails.listOfUsers": {
//               $elemMatch: {
//                 userID: mongoose.Types.ObjectId(msg.user_id),
//                 isAccepted: 1,
//               },
//             },
//           },
//         ],
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
//         NoOfComments: { $ifNull: ["$NoOfComments", 0] },
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
//         acceptedUsersSQLIds: {
//           $filter: {
//             input: "$communityDetails.listOfUsers",
//             as: "user",
//             cond: { $eq: ["$$user.isAccepted", 1] },
//           },
//         },
//       },
//     },
//   ])
//     .sort({ createdAt: -1 })
//     .then((result) => {
//       res.data = result;
//       res.status = 200;
//       callback(null, res);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status = 500;
//       callback(null, res);
//     });
// };

const getAllPostsWithUserId = async (msg, callback) => {
  let res = {};
  console.log(msg.user_id);
  const userId = msg.user_id;
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

    {
      $match: {
        $or: [
          {
            "communityDetails.ownerID": mongoose.Types.ObjectId(msg.user_id),
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
    // {
    //   $unwind: {
    //     path: "$userDetails",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
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
        NoOfComments: { $ifNull: ["$NoOfComments", 0] },
        description: { $ifNull: ["$description", ""] },
        link: { $ifNull: ["$link", ""] },
        postImageUrl: { $ifNull: ["$postImageUrl", ""] },
        upvotedBy: "$upvotedBy",
        downvotedBy: "$downvotedBy",
        createdAt: "$createdAt",
        userMongoID: "$userDetails._id",
        userSQLID: "$userDetails.userIDSQL",
        userID: "$userDetails", // only if needed
        communityID: "$communityDetails._id",
        communityName: "$communityDetails.communityName",
        commentsDetails: "$commentsDetails",
        communityDescription: "$communityDetails.communityDescription",
        imageURL: "$communityDetails.imageURL",
        acceptedUsersSQLIds: {
          $filter: {
            input: "$communityDetails.listOfUsers",
            as: "user",
            cond: { $eq: ["$$user.isAccepted", 1] },
          },
        },
        score: {
          $subtract: [{ $size: "$upvotedBy" }, { $size: "$downvotedBy" }],
        },
        userVoteDir: {
          $cond: {
            if: {
              //   upvotedBy: { $in: [userId, "$upvotedBy"] },
              $setIsSubset: [
                [{ _id: mongoose.Types.ObjectId(userId) }],
                "$upvotedBy",
              ],
            },
            then: 1,
            else: {
              $cond: {
                if: {
                  $setIsSubset: [
                    [{ _id: mongoose.Types.ObjectId(userId) }],
                    "$downvotedBy",
                  ],
                },
                then: -1,
                else: 0,
              },
            },
          },
        },
        commentsCount: { $size: "$commentsDetails" },
      },
    },
  ])
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log("results in posts userId specific community = ", result);
      // const responseData = JSON.parse(JSON.stringify(result));
      res.data = result;
      res.status = 200;
      callback(null, res);
      // if (responseData && responseData.length > 0) {
      //   responseData.forEach((resp, index) => {
      //     const entityId = resp._id;
      //     console.log("searching for ", entityId);
      //     Vote.aggregate(
      //       [
      //         {
      //           $match: {
      //             entityId: mongoose.Types.ObjectId(entityId),
      //           },
      //         },

      //         {
      //           $group: {
      //             _id: "$entityId",
      //             upvoteCount: {
      //               $sum: {
      //                 $sum: {
      //                   $cond: {
      //                     if: { $eq: ["$voteDir", 1] },
      //                     then: 1,
      //                     else: 0,
      //                   },
      //                 },
      //               },
      //             },
      //             downvoteCount: {
      //               $sum: {
      //                 $cond: {
      //                   if: { $eq: ["$voteDir", -1] },
      //                   then: 1,
      //                   else: 0,
      //                 },
      //               },
      //             },
      //             userVoteDir: {
      //               $sum: {
      //                 $cond: {
      //                   if: {
      //                     $eq: ["$userId", mongoose.Types.ObjectId(userId)],
      //                   },
      //                   then: {
      //                     $cond: {
      //                       if: {
      //                         $eq: ["$voteDir", -1],
      //                       },
      //                       then: -1,
      //                       else: {
      //                         $cond: {
      //                           if: {
      //                             $eq: ["$voteDir", 1],
      //                           },
      //                           then: 1,
      //                           else: 0,
      //                         },
      //                       },
      //                     },
      //                   },
      //                   else: 0,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       ],
      //       (err, result) => {
      //         console.log("result c = ", result);
      //         if (err) {
      //           console.log("error = ", err);
      //           res.status = 500;
      //           callback(null, res);
      //         } else {
      //           resp.score = resp.upvoteCount = resp.downvoteCount = resp.userVoteDir = 0;
      //           if (result && result[0]) {
      //             resp.score = result[0].upvoteCount - result[0].downvoteCount;
      //             resp.upvoteCount = result[0].upvoteCount;
      //             resp.downvoteCount = result[0].downvoteCount;
      //             resp.userVoteDir = result[0].userVoteDir;
      //             // console.log("resp userDetails = ", resp.userDetails[0]);
      //             // resp.userID = resp.userDetails[0];
      //             resp.commentsCount = resp.commentsDetails.length;
      //             // delete resp.userDetails;
      //             delete resp.commentDetails;
      //             // resp.userVoteDir = result[0].userVoteDir;
      //           } else {
      //             resp.score = 0;
      //             resp.upvoteCount = 0;
      //             resp.downvoteCount = 0;
      //             resp.userVoteDir = 0;
      //             // console.log("resp userDetails = ", resp.userDetails[0]);
      //             // resp.userID = resp.userDetails[0];
      //             resp.commentsCount = resp.commentsDetails.length;
      //             // delete resp.userDetails;
      //             delete resp.commentDetails;
      //           }
      //         }
      //         if (index == responseData.length - 1) {
      //           console.log("response data = ", responseData);
      //           res.data = responseData;
      //           res.status = 200;
      //           callback(null, res);
      //         }
      //       }
      //     );
      //   });
      // } else {
      //   res.data = responseData;
      //   res.status = 200;
      //   callback(null, res);
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status = 500;
      callback(null, res);
    });
};

exports.getAllPostsWithUserId = getAllPostsWithUserId;
