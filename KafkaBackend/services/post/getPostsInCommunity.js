const Post = require("../../models/mongo/Post");
const Vote = require("../../models/mongo/vote");
const mongoose = require("mongoose");

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
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "entityId",
        pipeline: [
          {
            $match: { $_id: userId },
          },
        ],
        as: "voteDetails",
      },
    },
    {
      $lookup: {
        from: "votes",
        pipeline: [
          {
            $match: {
              entityId: mongoose.Types.ObjectId(msg.query.ID),
            },
          },
          {
            $group: {
              _id: "$entityId",
              //   count: { $sum: 1 },
              userVoteDire: {
                $sum: {
                  $cond: {
                    if: {
                      $eq: ["$userId", [mongoose.Types.ObjectId(userId)]],
                    },
                    then: {
                      $cond: {
                        if: {
                          $eq: ["$voteDir", [-1]],
                        },
                        then: -1,
                        else: {
                          $cond: {
                            if: {
                              $eq: ["$voteDir", [1]],
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
        as: "score",
      },
    },
    // {
    //   $group: {
    //     _id: "$voteDetails.entityId",
    //     upvoteCount: {
    //       $sum: {
    //         $sum: {
    //           $cond: {
    //             if: { $eq: ["$vote.Details.voteDir", [1]] },
    //             then: 1,
    //             else: 0,
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    {
      $project: {
        userDetails: "$userDetails",
        userVoteDir: {
          $lookup: {
            from: "votes",
            localField: "_id",
            foreignField: "entityId",
            as: "voteDetails",
          },
          //   $sum: {
          //     $cond: {
          //       if: {
          //         $eq: ["$voteDetails.userId", [mongoose.Types.ObjectId(userId)]],
          //       },
          //       then: {
          //         $cond: {
          //           if: {
          //             $eq: ["$voteDetials.voteDir", [-1]],
          //           },
          //           then: -1,
          //           else: {
          //             $cond: {
          //               if: {
          //                 $eq: ["$voteDetails.voteDir", [1]],
          //               },
          //               then: 1,
          //               else: 0,
          //             },
          //           },
          //         },
          //       },
          //       else: 0,
          //     },
          //   },
        },
        // score: {
        //   $subtract: [
        //     {
        //       $sum: {
        //         $sum: {
        //           $cond: {
        //             if: { $eq: ["$voteDetails.voteDir", [1]] },
        //             then: 1,
        //             else: 0,
        //           },
        //         },
        //       },
        //     },
        //     {
        //       $sum: {
        //         $cond: {
        //           if: { $eq: ["$voteDetails.voteDir", [-1]] },
        //           then: 1,
        //           else: 0,
        //         },
        //       },
        //     },
        //   ],
        // },
        _id: "$_id",
        communityID: "$communityID",
        type: "$type",
        title: "$title",
        description: "$description",
        userID: "$userDetails",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        commentDetails: "$commentDetails",
        voteDetails: "$voteDetails.userId",
        score: "$score",
        upvoteCount: "$upvoteCount",
        commentsCount: { $size: "$commentsDetails" },
        //     type: "$type",
        //     title: "$title",
        //     NoOfComments: { $ifNull: ["$NoOfComments", 0] },
        //     description: { $ifNull: ["$description", ""] },
        //     link: { $ifNull: ["$link", ""] },
        //     postImageUrl: { $ifNull: ["$postImageUrl", ""] },
        //     upvotedBy: "$upvotedBy",
        //     downvotedBy: "$downvotedBy",
        //     createdAt: "$createdAt",
        //     userMongoID: "$userDetails._id",
        //     userSQLID: "$userDetails.userIDSQL",
        //     userName: "$userDetails.name", // only if needed
        //     communityName: "$communityDetails.communityName",
        //     commentsDetails: "$commentsDetails",
        //     communityDescription: "$communityDetails.communityDescription",
        //     imageURL: "$communityDetails.imageURL",
        //     acceptedUsersSQLIds: {
        //       $filter: {
        //         input: "$communityDetails.listOfUsers",
        //         as: "user",
        //         cond: { $eq: ["$$user.isAccepted", 1] },
        //       },
        //     },
      },
    },
  ])
    // Post.find({ communityID: mongoose.Types.ObjectId(msg.query.ID) })
    // .populate("userID")
    .then((result) => {
      console.log("results in posts community = ", result);
      console.log("results in posts community score*** = ", result[0].score);
      res.data = result;
      res.status = 200;
      callback(null, res);
      //   console.log("vote details = ", result[0].voteDetails);
      //   const responseData = JSON.parse(JSON.stringify(result));
      //   if (responseData && responseData.length > 0) {
      //     responseData.forEach((resp, index) => {
      //       const entityId = resp._id;
      //       console.log("searching for ", entityId);
      //       Vote.aggregate(
      //         [
      //           {
      //             $match: {
      //               entityId: mongoose.Types.ObjectId(entityId),
      //             },
      //           },

      //           {
      //             $group: {
      //               _id: "$entityId",
      //               upvoteCount: {
      //                 $sum: {
      //                   $sum: {
      //                     $cond: {
      //                       if: { $eq: ["$voteDir", 1] },
      //                       then: 1,
      //                       else: 0,
      //                     },
      //                   },
      //                 },
      //               },
      //               downvoteCount: {
      //                 $sum: {
      //                   $cond: {
      //                     if: { $eq: ["$voteDir", -1] },
      //                     then: 1,
      //                     else: 0,
      //                   },
      //                 },
      //               },
      //               userVoteDir: {
      //                 $sum: {
      //                   $cond: {
      //                     if: {
      //                       $eq: ["$userId", mongoose.Types.ObjectId(userId)],
      //                     },
      //                     then: {
      //                       $cond: {
      //                         if: {
      //                           $eq: ["$voteDir", -1],
      //                         },
      //                         then: -1,
      //                         else: {
      //                           $cond: {
      //                             if: {
      //                               $eq: ["$voteDir", 1],
      //                             },
      //                             then: 1,
      //                             else: 0,
      //                           },
      //                         },
      //                       },
      //                     },
      //                     else: 0,
      //                   },
      //                 },
      //               },
      //             },
      //           },
      //         ],
      //         (err, result) => {
      //           console.log("result c = ", result);
      //           if (err) {
      //             console.log("error = ", err);
      //             res.status = 500;
      //             callback(null, res);
      //           } else {
      //             resp.score = resp.upvoteCount = resp.downvoteCount = resp.userVoteDir = 0;
      //             console.log("result posts in community = ", result);
      //             if (result && result[0]) {
      //               resp.score = result[0].upvoteCount - result[0].downvoteCount;
      //               resp.upvoteCount = result[0].upvoteCount;
      //               resp.downvoteCount = result[0].downvoteCount;
      //               resp.userVoteDir = result[0].userVoteDir;
      //               console.log("resp userDetails = ", resp.userDetails[0]);
      //               resp.userID = resp.userDetails[0];
      //               resp.commentsCount = resp.commentsDetails.length;
      //               delete resp.userDetails;
      //               delete resp.commentDetails;
      //               // resp.userVoteDir = result[0].userVoteDir;
      //             } else {
      //               resp.score = 0;
      //               resp.upvoteCount = 0;
      //               resp.downvoteCount = 0;
      //               // console.log("resp userDetails = ", resp.userDetails[0]);
      //               resp.userID = resp.userDetails[0];
      //               resp.commentsCount = resp.commentsDetails.length;
      //               delete resp.userDetails;
      //               delete resp.commentDetails;
      //             }
      //           }
      //           if (index == responseData.length - 1) {
      //             console.log("response data = ", responseData);
      //             res.data = responseData;
      //             res.status = 200;
      //             callback(null, res);
      //           }
      //         }
      //       );
      //     });
      //   } else {
      //     res.data = responseData;
      //     res.status = 200;
      //     callback(null, res);
      //   }
      res.data = "jk";
      res.status = 200;
      callback(null, res);
    })
    .catch((err) => {
      console.log("err - ", err);
      res.status = 500;
      callback(null, res);
    });
};

exports.getPostsInCommunity = getPostsInCommunity;
