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
        console.log(err);
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

  if (req.body.type == 0) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      userID: req.body.userID,
    };
  } else if (req.body.type == 1) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      link: req.body.link,
      userID: req.body.userID,
    };
  } else if (req.body.type == 2) {
    data = {
      communityID: req.body.community_id,
      type: req.body.type,
      title: req.body.title,
      postImageUrl: req.body.postImageUrl,
      userID: req.body.userID,
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
  Post.find({ communityID: req.query.ID })
    .populate("userID")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
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
            // console.log(result);
            if (err) {
              return res.status(500).send(err);
            } else {
              resp.score = resp.upvoteCount = resp.downvoteCount = 0;
              if (result && result[0]) {
                resp.score = result[0].upvoteCount - result[0].downvoteCount;
                resp.upvoteCount = result[0].upvoteCount;
                resp.downvoteCount = result[0].downvoteCount;
              }
            }
            if (index == responseData.length - 1) {
              res.status(200).send(responseData);
            }
          }
        );
      });
    } else {
      res.status(200).send(responseData);
    }
  });
});
module.exports = router;
