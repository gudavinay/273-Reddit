var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Vote = require("../../models/mongo/Vote");

const mongoose = require("mongoose");
/* get communities */
app.get("/getCommunities", function (req, res, next) {
  current_user = req.body.u_id;
  console.log(current_user);
  Community.find(
    {
      listOfUsers: {
        $elemMatch: { userID: current_user, isAccepted: true },
      },
    },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log("result");
        let myCommunities = [];

        for (let i = 0; i < result.length; i++) {
          let community = {
            community_id: result[i]._id,
            community_name: result[i].communityName,
          };
          myCommunities.push(community);
        }
        console.log(myCommunities);
        res.status(200).send(myCommunities);
      }
    }
  );
  // Community.find({});
});

app.get("/communityDetails", function (req, res, next) {
  c_id = req.body.community_id;
  Community.find(
    {
      _id: c_id,
    },
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        let communityDetails = {
          communityName: result[0].communityName,
          communityDescription: result[0].communityDescription,
        };
        res.status(200).send(communityDetails);
      }
    }
  );
});

app.post("/createPost", function (req, res, next) {
  let data = {};
  console.log("create post req.body = ", req.body);
  if (req.body.type == 0) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      userID: req.body.user_id,
    };
  } else if (req.body.type == 1) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      link: req.body.link,
      userID: req.body.user_id,
    };
  } else if (req.body.type == 2) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      postImageUrl: req.body.postImageUrl,
      userID: req.body.user_id,
    };
  }
  new Post(data).save((err, result) => {
    if (err) {
      res.status(500).send(err);
    }

    res.status(200).send(result);
    // Community.updateOne(
    //   { _id: req.body.community_id },
    //   {
    //     $push: { posts: [{ postID: result._id }] },
    //   },
    //   (err, result) => {
    //     if (err) {
    //       res.status(500).send(err);
    //     }
    //     res.status(200).send(result);
    //   }
    // );
  });
});

app.post("/comment", (req, res) => {
  let comment = {};
  if (req.body.isParentComment) {
    comment = {
      postID: req.body.postID,
      description: req.body.description,
      isParentComment: req.body.isParentComment,
      userID: req.body.userID,
    };
    new Comment(comment).save((err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(result);
    });
  } else {
    comment = {
      postID: req.body.postID,
      description: req.body.description,
      isParentComment: req.body.isParentComment,
      userID: req.body.userID,
      parentCommentID: req.body.parentCommentID,
    };
    new Comment(comment).save((err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(result);
      // Comment.updateOne(
      //   { _id: req.body.parentID },
      //   {
      //     $push: { subComment: [{ commentID: result._id }] },
      //   },
      //   (err, result) => {
      //     if (err) {
      //       res.status(500).send(err);
      //     }
      //     res.status(200).send(result);
      //   }
      // );
    });
  }
});

app.get("/getPostsInCommunity", (req, res) => {
  console.log("req.body posts = ", req.query);
  const userId = req.query.userId;
  Post.aggregate([
    {
      $match: {
        communityID: mongoose.Types.ObjectId(req.query.ID),
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
  ])
    // Post.find({ communityID: mongoose.Types.ObjectId(req.query.ID) })
    // .populate("userID")
    .then((result) => {
      console.log("results in posts community = ", result);
      const responseData = JSON.parse(JSON.stringify(result));
      if (responseData && responseData.length > 0) {
        responseData.forEach((resp, index) => {
          const entityId = resp._id;
          console.log("searching for ", entityId);
          Vote.aggregate(
            [
              {
                $match: {
                  entityId: mongoose.Types.ObjectId(entityId),
                },
              },

              {
                $group: {
                  _id: "$entityId",
                  upvoteCount: {
                    $sum: {
                      $sum: {
                        $cond: {
                          if: { $eq: ["$voteDir", 1] },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                  },
                  downvoteCount: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$voteDir", -1] },
                        then: 1,
                        else: 0,
                      },
                    },
                  },
                  userVoteDir: {
                    $sum: {
                      $cond: {
                        if: {
                          $eq: ["$userId", mongoose.Types.ObjectId(userId)],
                        },
                        then: {
                          $cond: {
                            if: {
                              $eq: ["$voteDir", -1],
                            },
                            then: -1,
                            else: {
                              $cond: {
                                if: {
                                  $eq: ["$voteDir", 1],
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
            (err, result) => {
              console.log("result c = ", result);
              if (err) {
                console.log("error = ", err);
                return res.status(500).send(err);
              } else {
                resp.score = resp.upvoteCount = resp.downvoteCount = resp.userVoteDir = 0;
                if (result && result[0]) {
                  resp.score = result[0].upvoteCount - result[0].downvoteCount;
                  resp.upvoteCount = result[0].upvoteCount;
                  resp.downvoteCount = result[0].downvoteCount;
                  console.log("resp userDetails = ", resp.userDetails[0]);
                  resp.userID = resp.userDetails[0];
                  resp.commentsCount = resp.commentsDetails.length;
                  delete resp.userDetails;
                  delete resp.commentDetails;
                  // resp.userVoteDir = result[0].userVoteDir;
                } else {
                  resp.score = 0;
                  resp.upvoteCount = 0;
                  resp.downvoteCount = 0;
                  // console.log("resp userDetails = ", resp.userDetails[0]);
                  resp.userID = resp.userDetails[0];
                  resp.commentsCount = resp.commentsDetails.length;
                  delete resp.userDetails;
                  delete resp.commentDetails;
                }
              }
              if (index == responseData.length - 1) {
                console.log("response data = ", responseData);
                res.status(200).send(responseData);
              }
            }
          );
        });
      } else {
        res.status(200).send(responseData);
      }
      // res.status(200).send(result);
    })
    .catch((err) => {
      console.log("err - ", err);
      res.status(500).send(err);
    });
});

app.post("/vote", (req, res) => {
  if (req.body.voteType == "U") {
    Comment.updateOne(
      { _id: req.body.commentID },
      {
        $push: { upvotedBy: [{ userID: req.body.user_id }] },
      },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      }
    );
  } else if (req.body.voteType == "D") {
    Comment.updateOne(
      { _id: req.body.commentID },
      {
        $push: { downvotedBy: [{ userID: req.body.user_id }] },
      },
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      }
    );
  }
});
app.post("/getCommentsWithPostID", (req, res) => {
  // const userId = "6089d660e18b492c2a4e5b19";
  const userId = req.body.userId;
  console.log("userId =  ", userId);
  Comment.find({ postID: req.body.postID }, (err, result) => {
    if (err) {
      res.status(500).send("Internal server error...");
    }
    const responseData = JSON.parse(JSON.stringify(result));
    if (responseData && responseData.length > 0) {
      responseData.forEach((resp, index) => {
        const entityId = resp._id;
        // console.log("searching for ", entityId);
        Vote.aggregate(
          [
            {
              $match: {
                entityId: mongoose.Types.ObjectId(entityId),
              },
            },

            {
              $group: {
                _id: "$entityId",
                // userId: { $first: "$userId" },
                // entityId: entityId,
                upvoteCount: {
                  $sum: {
                    $sum: {
                      $cond: { if: { $eq: ["$voteDir", 1] }, then: 1, else: 0 },
                    },
                  },
                },
                downvoteCount: {
                  $sum: {
                    $cond: { if: { $eq: ["$voteDir", -1] }, then: 1, else: 0 },
                  },
                },
                userVoteDir: {
                  $sum: {
                    $cond: {
                      if: {
                        $eq: ["$userId", mongoose.Types.ObjectId(userId)],
                        // },
                      },
                      // then: {
                      //   $cond: {
                      //     if: {
                      //       $eq: ["$voteDir", -1],
                      //     },
                      //     then: -1,
                      //     else: 0,
                      //   },
                      // },
                      then: {
                        $cond: {
                          if: {
                            $eq: ["$voteDir", -1],
                          },
                          then: -1,
                          else: {
                            $cond: {
                              if: {
                                $eq: ["$voteDir", 1],
                              },
                              then: 1,
                              else: 0,
                            },
                          },
                        },
                      },
                      else: 0,
                      // else: {
                      //   $cond: {
                      //     if: {
                      //       $eq: ["$voteDir", 1],
                      //     },
                      //     then: 1,
                      //     else: 0,
                      //   },
                      // },
                    },
                  },
                },
              },
            },
            // {
            //   $project: {
            //     _id: 0,
            //     upvoteCount: "$upvoteCount",
            //     downvoteCount: "$downvoteCount"
            //   }
            // }
          ],
          (err, result) => {
            console.log("result = ", result);
            if (err) {
              return res.status(500).send(err);
            } else {
              resp.score = resp.upvoteCount = resp.downvoteCount = resp.userVoteDir = 0;
              if (result && result[0]) {
                resp.score = result[0].upvoteCount - result[0].downvoteCount;
                resp.upvoteCount = result[0].upvoteCount;
                resp.downvoteCount = result[0].downvoteCount;
                resp.userVoteDir = result[0].userVoteDir;
              } else {
                resp.score = 0;
                resp.upvoteCount = 0;
                resp.downvoteCount = 0;
                resp.userVoteDir = 0;
              }
            }
            if (index == responseData.length - 1) {
              const resul = responseData.sort(
                (a, b) => b.upvoteCount - a.upvoteCount
              );
              res.status(200).send(resul);
            }
          }
        );
      });
    } else {
      res.status(200).send(responseData);
    }
  });
});

//get all posts for dashboard
app.post("/getAllPostsWithUserId", (req, res) => {
  console.log(req.body.user_id);
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
              req.body.user_id
            ),
          },
          {
            "communityDetails.listOfUsers.userID": mongoose.Types.ObjectId(
              req.body.user_id
            ),
            "communityDetails.listOFUsers.isAccepted": 1,
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
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
