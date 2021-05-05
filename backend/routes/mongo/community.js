var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const Post = require("../../models/mongo/Post");

app.post("/addCommunity", function (req, res, next) {
  let topicList = [];
  req.body.selectedTopic.map(topic => {
    topicList.push({
      topic: topic.topic
    });
  });
  let community = new Community({
    communityIDSQL: req.body.communityIDSQL,
    communityName: req.body.communityName,
    communityDescription: req.body.communityDescription,
    ownerID: req.body.ownerID,
    topicSelected: topicList,
    imageURL: req.body.communityImages,
    rules: req.body.listOfRules
  });
  community.save((error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error Occured");
    } else {
      res.status(200).send(JSON.stringify(data));
    }
  });
});

app.get("/myCommunity", function (req, res) {
  let data = [];
  Community.find({ ownerID: req.query.ID }).then((result, error) => {
    if (error) {
      res.status(500).send("Error Occured");
    } else {
      const findResult = JSON.parse(JSON.stringify(result));
      findResult.map(community => {
        Post.find({ communityID: community._id }).then((postResult, error) => {
          console.log(JSON.stringify(postResult.length));
          data.push({
            _id: community._id,
            communityName: community.communityName,
            communityDescription: community.communityDescription,
            imageURL: community.communityImages,
            listOfUsers: community.listOfUsers,
            count: postResult.length
          });
          console.log(JSON.stringify(data));
          if (result.length == data.length) {
            console.log(JSON.stringify(data));
            res.status(200).send(JSON.stringify(data));
          }
        });
      });
    }
  });
});

app.get("/getCommunitiesForOwner", async (req, res) => {
  let skip = Number(req.query.page) * Number(req.query.size);
  let count = await Community.count({
    $and: [
      { ownerID: req.query.ID },
      { communityName: { $regex: req.query.search } }
    ]
  });
  console.log(count);
  await Community.find({
    $and: [
      { ownerID: req.query.ID },
      { communityName: { $regex: req.query.search, $options: "i" } }
    ]
  })
    .populate("listOfUsers.userID")
    .limit(Number(req.query.size))
    .skip(skip)
    .then(result => {
      let output = [];
      result.forEach(item => {
        let usersIdOfSQL = [];
        let acceptedIdOfSQL = [];
        for (let i = 0; i < item.listOfUsers.length; i++) {
          if (!item.listOfUsers[i].isAccepted) {
            usersIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
          } else {
            acceptedIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
          }
        }
        let data = JSON.parse(JSON.stringify(item));
        data.requestedUserSQLIds = usersIdOfSQL;
        data.acceptedUsersSQLIds = acceptedIdOfSQL;
        delete data.listOfUsers;
        delete data.upvotedBy;
        delete data.downvotedBy;
        delete data.sentInvitesTo;
        delete data.imageURL;
        delete data.posts;
        delete data.rules;
        delete data.topicSelected;
        output.push(data);
      });
      res.status(200).send({ com: output, total: count });
    });
});

app.get("/getUsersForCommunitiesForOwner", (req, res) => {
  Community.find({
    ownerID: req.query.ID
  })
    .populate("listOfUsers.userID")
    .then(result => {
      let output = new Set();
      result.forEach(item => {
        for (let i = 0; i < item.listOfUsers.length; i++) {
          if (item.listOfUsers[i].isAccepted) {
            output.add(Number(item.listOfUsers[i].userID.userIDSQL));
          }
        }
      });
      res.status(200).send(Array.from(output));
    });
});

// app.get("/getUsersForCommunitiesForOwner", async (req, res) => {
//   let skip = req.query.page * req.query.size;
//   let count = await Community.count({
//     $and: [{ ownerID: req.query.ID }, { communityName: /req.query.search/i }],
//   });
//   console.log(count);
//   await Community.find({
//     $and: [{ ownerID: req.query.ID }, { communityName: /req.query.search/i }],
//   })
//     .populate("listOfUsers.userID")
//     .then((result) => {
//       let output = new Set();
//       result.forEach((item) => {
//         for (let i = 0; i < item.listOfUsers.length; i++) {
//           if (item.listOfUsers[i].isAccepted) {
//             output.add(Number(item.listOfUsers[i].userID.userIDSQL));
//           }
//         }
//       });
//       res.status(200).send({ output: Array.from(output), total: count });
//     });
// });

module.exports = router;
