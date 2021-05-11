var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const User = require("../../models/mongo/UserProfile");

app.post("/sendInvite", async (req, res) => {
  var members = [];
  req.body.users.forEach((user) => {
    const userData = {
      userID: user.user_id,
    };
    members.push(userData);
  });
  console.log(members);
  Community.findOneAndUpdate(
    { _id: req.body.community_id },
    {
      $push: { sentInvitesTo: members },
    },
    async (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        try {
          var r = await new Promise((resolve, reject) => {
            members.forEach((user) => {
              User.findByIdAndUpdate(
                user.userID,
                {
                  $push: {
                    communityInvites: [
                      {
                        communityID: req.body.community_id,
                        invitedBy: req.body.invitedBy,
                      },
                    ],
                  },
                },
                (err, d) => {
                  if (err) {
                    reject(false);
                  }
                  resolve(true);
                }
              );
            });
          });
          if (r) res.status(200).send({ msg: "Invites sent" });
        } catch (error) {
          res.status(500).send({ msg: "error" });
        }
      }
    }
  );
});
//TO show the users who are invited and the status of invitation
app.post("/showInvitationStatus", async (req, res) => {
  let { page, size } = req.body;
  let skip = 0;
  if (page == 0) {
    skip = 0;
  } else {
    skip = page * size;
  }
  const limit = parseInt(size);
  const recordCount = await new Promise((resolve, reject) => {
    Community.findOne({ _id: req.body.community_id }).then((result) => {
      resolve(Object.keys(result.sentInvitesTo).length);
    });
  });
  console.log(limit);
  console.log(skip);

  Community.findOne(
    { _id: req.body.community_id },
    { sentInvitesTo: { $slice: [skip, limit] } }
  )
    .populate("sentInvitesTo.userID", ["userIDSQL", "name"])
    .then(async (result) => {
      let data = {};
      data.sentInvitesTo = JSON.parse(JSON.stringify(result.sentInvitesTo));
      let users = [];

      result.sentInvitesTo.forEach((sentInvite) => {
        users.push(sentInvite.userID._id);
      });

      result.listOfUsers.forEach((user) => {
        users.push(user.userID._id);
      });

      data.listOfInvolvedUsers = users;
      data.totalRecords = recordCount;
      res.status(200).send(data);
      // res.status(200).send(data.sentInvitesTo);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// app.post("/getCommunitiesCreatedByMe", (req, res) => {
//   Community.find({ ownerID: req.body.user_id }, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send(err);
//     } else {
//       let communities = [];
//       result.forEach((element) => {
//         let communityDetails = {
//           communityName: element.communityName,
//           communityID: element._id,
//         };
//         communities.push(communityDetails);
//       });
//       res.status(200).send(communities);
//     }
//   });
// });
module.exports = router;
