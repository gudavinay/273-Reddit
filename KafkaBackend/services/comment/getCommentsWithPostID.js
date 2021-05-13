// const Comment = require("../../models/mongo/Comment");
// const Vote = require("../../models/mongo/vote");
// const mongoose = require("mongoose");

// const getCommentsWithPostID = async (msg, callback) => {
//   let res = {};
//   const userId = msg.userId;
//   console.log("userId =  ", userId);
//   Comment.find({ postID: msg.postID })
//     .populate("userID")
//     .then((result) => {
//       const responseData = JSON.parse(JSON.stringify(result));
//       if (responseData && responseData.length > 0) {
//         responseData.forEach((resp, index) => {
//           const entityId = resp._id;
//           // console.log("searching for ", entityId);
//           Vote.aggregate(
//             [
//               {
//                 $match: {
//                   entityId: mongoose.Types.ObjectId(entityId),
//                 },
//               },
//               {
//                 $group: {
//                   _id: "$entityId",
//                   // userId: { $first: "$userId" },
//                   // entityId: entityId,
//                   upvoteCount: {
//                     $sum: {
//                       $sum: {
//                         $cond: {
//                           if: { $eq: ["$voteDir", 1] },
//                           then: 1,
//                           else: 0,
//                         },
//                       },
//                     },
//                   },
//                   downvoteCount: {
//                     $sum: {
//                       $cond: {
//                         if: { $eq: ["$voteDir", -1] },
//                         then: 1,
//                         else: 0,
//                       },
//                     },
//                   },
//                   userVoteDir: {
//                     $sum: {
//                       $cond: {
//                         if: {
//                           $eq: ["$userId", mongoose.Types.ObjectId(userId)],
//                           // },
//                         },
//                         // then: {
//                         //   $cond: {
//                         //     if: {
//                         //       $eq: ["$voteDir", -1],
//                         //     },
//                         //     then: -1,
//                         //     else: 0,
//                         //   },
//                         // },
//                         then: {
//                           $cond: {
//                             if: {
//                               $eq: ["$voteDir", -1],
//                             },
//                             then: -1,
//                             else: {
//                               $cond: {
//                                 if: {
//                                   $eq: ["$voteDir", 1],
//                                 },
//                                 then: 1,
//                                 else: 0,
//                               },
//                             },
//                           },
//                         },
//                         else: 0,
//                         // else: {
//                         //   $cond: {
//                         //     if: {
//                         //       $eq: ["$voteDir", 1],
//                         //     },
//                         //     then: 1,
//                         //     else: 0,
//                         //   },
//                         // },
//                       },
//                     },
//                   },
//                 },
//                 // then: -1,
//                 // else: 0
//               },
//               // {
//               //   $project: {
//               //     _id: 0,
//               //     upvoteCount: "$upvoteCount",
//               //     downvoteCount: "$downvoteCount"
//               //   }
//               // }
//             ],
//             (err, result) => {
//               console.log("result = ", result);
//               if (err) {
//                 res.status = 500;
//                 callback(null, res);
//               } else {
//                 resp.score =
//                   resp.upvoteCount =
//                   resp.downvoteCount =
//                   resp.userVoteDir =
//                     0;
//                 if (result && result[0]) {
//                   resp.score = result[0].upvoteCount - result[0].downvoteCount;
//                   resp.upvoteCount = result[0].upvoteCount;
//                   resp.downvoteCount = result[0].downvoteCount;
//                   resp.userVoteDir = result[0].userVoteDir;
//                 } else {
//                   resp.score = 0;
//                   resp.upvoteCount = 0;
//                   resp.downvoteCount = 0;
//                   resp.userVoteDir = 0;
//                 }
//               }
//               if (index == responseData.length - 1) {
//                 const resul = responseData.sort(
//                   (a, b) => b.upvoteCount - a.upvoteCount
//                 );
//                 res.data = resul;
//                 res.status = 200;
//                 callback(null, res);
//               }
//             }
//           );
//         });
//       } else {
//         res.data = responseData;
//         res.status = 200;
//         callback(null, res);
//       }
//     })
//     .catch((err) => {
//       res.status = 500;
//       res.data = "Internal Server Error";
//       callback(null, res);
//     });
// };

// exports.getCommentsWithPostID = getCommentsWithPostID;

const Comment = require("../../models/mongo/Comment");
const Vote = require("../../models/mongo/vote");
const mongoose = require("mongoose");

// const getCommentsWithPostID = async (msg, callback) => {
//   let res = {};
//   const userId = msg.userId;
//   console.log("userId =  ", userId);
//   Comment.find({ postID: msg.postID }, (err, result) => {
//     if (err) {
//       res.status = 500;
//       res.data = "Internal Server Error";
//       callback(null, res);
//     }
//     const responseData = JSON.parse(JSON.stringify(result));
//     if (responseData && responseData.length > 0) {
//       responseData.forEach((resp, index) => {
//         const entityId = resp._id;
//         // console.log("searching for ", entityId);
//         Vote.aggregate(
//           [
//             {
//               $match: {
//                 entityId: mongoose.Types.ObjectId(entityId),
//               },
//             },

//             {
//               $group: {
//                 _id: "$entityId",
//                 // userId: { $first: "$userId" },
//                 // entityId: entityId,
//                 upvoteCount: {
//                   $sum: {
//                     $sum: {
//                       $cond: { if: { $eq: ["$voteDir", 1] }, then: 1, else: 0 },
//                     },
//                   },
//                 },
//                 downvoteCount: {
//                   $sum: {
//                     $cond: { if: { $eq: ["$voteDir", -1] }, then: 1, else: 0 },
//                   },
//                 },
//                 userVoteDir: {
//                   $sum: {
//                     $cond: {
//                       if: {
//                         $eq: ["$userId", mongoose.Types.ObjectId(userId)],
//                         // },
//                       },
//                       // then: {
//                       //   $cond: {
//                       //     if: {
//                       //       $eq: ["$voteDir", -1],
//                       //     },
//                       //     then: -1,
//                       //     else: 0,
//                       //   },
//                       // },
//                       then: {
//                         $cond: {
//                           if: {
//                             $eq: ["$voteDir", -1],
//                           },
//                           then: -1,
//                           else: {
//                             $cond: {
//                               if: {
//                                 $eq: ["$voteDir", 1],
//                               },
//                               then: 1,
//                               else: 0,
//                             },
//                           },
//                         },
//                       },
//                       else: 0,
//                       // else: {
//                       //   $cond: {
//                       //     if: {
//                       //       $eq: ["$voteDir", 1],
//                       //     },
//                       //     then: 1,
//                       //     else: 0,
//                       //   },
//                       // },
//                     },
//                   },
//                 },
//               },
//             },
//             // {
//             //   $project: {
//             //     _id: 0,
//             //     upvoteCount: "$upvoteCount",
//             //     downvoteCount: "$downvoteCount"
//             //   }
//             // }
//           ],
//           (err, result) => {
//             console.log("result = ", result);
//             if (err) {
//               res.status = 500;
//               callback(null, res);
//             } else {
//               resp.score =
//                 resp.upvoteCount =
//                 resp.downvoteCount =
//                 resp.userVoteDir =
//                   0;
//               if (result && result[0]) {
//                 resp.score = result[0].upvoteCount - result[0].downvoteCount;
//                 resp.upvoteCount = result[0].upvoteCount;
//                 resp.downvoteCount = result[0].downvoteCount;
//                 resp.userVoteDir = result[0].userVoteDir;
//               } else {
//                 resp.score = 0;
//                 resp.upvoteCount = 0;
//                 resp.downvoteCount = 0;
//                 resp.userVoteDir = 0;
//               }
//             }
//             if (index == responseData.length - 1) {
//               const resul = responseData.sort(
//                 (a, b) => b.upvoteCount - a.upvoteCount
//               );
//               res.data = resul;
//               res.status = 200;
//               callback(null, res);
//             }
//           }
//         );
//       });
//     } else {
//       res.data = responseData;
//       res.status = 200;
//       callback(null, res);
//     }
//   });
// };

const getCommentsWithPostID = async (msg, callback) => {
  let res = {};
  const userId = msg.userId;
  console.log("userId*************************   ", userId);
  console.log("***************post*************  ", msg.postID);

  Comment.aggregate([
    {
      $match: {
        postID: mongoose.Types.ObjectId(msg.postID),
      },
    },
    {
      $project: {
        _id: "$_id",
        postID: "$postID",
        description: "$description",
        isParentComment: "$isParentComment",
        userID: "$userID",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        userVoteDir: {
          $cond: {
            if: {
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
        score: {
          $subtract: [{ $size: "$upvotedBy" }, { $size: "$downvotedBy" }],
        },
      },
    },
  ])
    .then((result) => {
      res.data = result;
      res.status = 200;
      callback(null, res);
    })
    .catch((err) => {
      console.log("err - ", err);
      res.status = 500;
      callback(null, res);
    });
};

exports.getCommentsWithPostID = getCommentsWithPostID;
