var express = require("express");
const app = require("../../app");
const router = express.Router();
const UserProfile = require("../../models/mongo/UserProfile");
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Message = require("../../models/mongo/Message");
const redisClient = require("./../../Util/redisConfig");

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
      if (result !== null) {
        result.communityInvites.forEach((element) => {
          let inviteDetails = {
            communityName: element.communityID.communityName,
            communityID: element.communityID._id,
            time: element.dateTime,
          };
          details.push(inviteDetails);
        });
      }
      res.status(200).send(details);
    })
    .catch((err) => {
      res.status(500).send(err);
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
            $set: {
              "sentInvitesTo.$.isAccepted": 1,
              "sentInvitesTo.$.dateTime": Date.now(),
            },
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

app.post("/createUserProfile", (req, res) => {
  let userProfile = new UserProfile({
    userIDSQL: req.body.sqlUserID,
    name: req.body.name,
    email: req.body.email,
  });
  userProfile.save((err, result) => {
    if (result) {
      res.status(200).send(JSON.stringify(result));
    } else res.status(200).send("Error occurred");
  });
});

app.get("/getUserProfile", (req, res) => {
  redisClient.get(req.query.ID, async (err, userProfile) => {
    if (userProfile) {
      res.status(200).send(userProfile);
    } else {
      UserProfile.find({ userIDSQL: req.query.ID }).then((result, error) => {
        if (error) {
          res.status(500).send("Error Occureed");
        } else {
          if (result.length > 0) {
            redisClient.setex(req.query.ID, 36000, JSON.stringify(result));
          }
          res.status(200).send(JSON.stringify(result));
        }
      });
    }
  });
});

app.get("/getUserProfileByMongoID", (req, res) => {
  UserProfile.findOne({ _id: req.query.ID }).then((result) => {
    res.status(200).send(result);
  });
});

app.post("/getListedUserDetails", async (req, res) => {
  let skip = Number(req.body.page) * Number(req.body.size);
  let count = await UserProfile.countDocuments({
    $and: [
      { userIDSQL: { $in: req.body.usersList } },
      { name: { $regex: req.body.search, $options: "i" } },
    ],
  });
  await UserProfile.find({
    $and: [
      { userIDSQL: { $in: req.body.usersList } },
      { name: { $regex: req.body.search, $options: "i" } },
    ],
  })
    .select({ userIDSQL: 1, name: 1, profile_picture_url: 1 })
    .limit(Number(req.body.size))
    .skip(skip)
    .sort({ name: 1 })
    .then((result) => {
      res.status(200).send({ users: result, total: count });
    });
});

app.post("/RequestedUsersForCom", async (req, res) => {
  // console.log(req.body.usersList);
  await UserProfile.find({
    _id: { $in: req.body.usersList },
  })
    .select({ userIDSQL: 1, name: 1, profile_picture_url: 1 })
    .then((result) => {
      let output = {};
      result.forEach((item) => {
        output[item._id] = {
          name: item.name,
          profile_picture_url: item.profile_picture_url,
        };
      });
      res.status(200).send(output);
    });
});

app.post("/createMessage", async (req, res) => {
  for (i = 0; i < 425; i++) {
    let userProfile = new Message({
      message: "Message" + i,
      sent_by: 54,
      sent_to: 53,
    });
    userProfile.save((err, result) => {});
  }
  //res.end(result);
});

app.get("/getMessageMongo", async (req, res) => {
  Message.find({}, (err, result) => {
    res.send(result);
  });
});

app.post("/getSearchedUserForMongo", async (req, res) => {
  UserProfile.find(
    {
      _id: { $nin: req.body.users },
      name: { $regex: req.body.name, $options: "i" },
    },
    { name: 1, _id: 1 }
  )
    .limit(5)
    .then(async (result) => {
      res.status(200).send(result);
    });
});

app.get("/checkUserIsModerator/:id", (req, res) => {
  console.log("checking user is moderator");
  user_id = req.params.id;
  Community.find({ ownerID: user_id }).then((result) => {
    let Communities = {
      length: result.length,
    };
    res.status(200).send(Communities);
  });
});
module.exports = router;
