var express = require("express");
const app = require("../../app");
const router = express.Router();
const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const passport = require("passport");

app.get("/createDummyData", function (req, res, next) {
  let userProfile = new UserProfile({
    userIDSQL: "2",
    listOfTopics: ["topic1", "topic2"],
    communityInvites: [],
  });
  userProfile.save();

  let community = new CommunityInfo({
    communityIDSQL: "2",
    communityName: "273",
    communityDescription: "first day",
    topicSelected: [
      {
        topic: "Art",
      },
    ],
    listOfUsers: [
      {
        userID: "6089d63ea112c02c1df2914c",
        isAccepted: false,
        isModerator: false,
      },
    ],
    ownerID: "6089d63ea112c02c1df2914c",
    upvotedBy: [],
    downvotedBy: [],
    createdDate: Date.now(),
    sentInvitesTo: [],
  });
  community.save();

  // let post = new Post({
  //   communityIDSQL: "608753d9749f2e093b5fed3f",
  //   type: "TEXT",
  //   link: null,
  //   description: "This is a dummy post.",
  //   title: "POST DUMMY TITLE",
  //   upvotedBy: [],
  //   downvotedBy: [],
  //   createdDate: Date.now(),
  //   comments: [],
  // });
  // post.save();

  // let comment = new Comment({
  //   postID: "6087559d4a8f9509d698bc9d",
  //   description: "TEST COMMENT",
  //   upvotedBy: [],
  //   downvotedBy: [],
  //   createdDate: Date.now(),
  //   subComment: [],
  //   isParentComment: true,
  // });
  // comment.save();

  res.send("inserted the dummy records");
});

app.post("/getNotificationData", (req, res) => {
  UserProfile.findOne({ _id: req.body.user_id })
    .populate("communityInvites.communityID")
    .then((result) => {
      let details = [];
      result.communityInvites.forEach((element) => {
        let inviteDetails = {
          communityName: element.communityID.communityName,
          communityID: element.communityID._id,
          time: element.dateTime,
        };
        details.push(inviteDetails);
      });
      res.status(200).send(details);
    });
});
app.post("/rejectInvite", (req, res) => {
  console.log("reject");
  UserProfile.findOneAndUpdate(
    { _id: req.body.user_id },
    {
      $pull: { communityInvites: { communityID: req.body.community_id } },
    },
    (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        Community.updateOne(
          {
            _id: req.body.community_id,
            "sentInvitesTo.userID": req.body.user_id,
          },
          {
            $set: { "sentInvitesTo.$.isAccepted": -1 },
          },
          (err, result) => {
            if (err) {
              res.status(404).send(err);
            } else {
              res.status(200).send(result);
            }
          }
        );
      }
    }
  );
});
app.post("/acceptInvite", (req, res) => {
  UserProfile.findOneAndUpdate(
    { _id: req.body.user_id },
    {
      $pull: { communityInvites: { communityID: req.body.community_id } },
    },
    (err, result) => {
      if (err) {
        res.status(404).send(err);
      } else {
        Community.updateOne(
          {
            _id: req.body.community_id,
            "sentInvitesTo.userID": req.body.user_id,
          },
          {
            $set: { "sentInvitesTo.$.isAccepted": 1 },
          },
          (err, result) => {
            if (err) {
              res.status(404).send(err);
            } else {
              Community.updateOne(
                { _id: req.body.community_id },
                {
                  $push: {
                    listOfUsers: [
                      { userID: req.body.user_id, isAccepted: true },
                    ],
                  },
                },
                (err, result) => {
                  if (err) {
                    res.status(404).send(err);
                  } else {
                    res.status(200).send(result);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
module.exports = router;
