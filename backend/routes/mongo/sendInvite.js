var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const User = require("../../models/mongo/UserProfile");

app.post("/sendInvite", async (req, res) => {
  var members = [];
  req.body.users.forEach((user) => {
    const userData = {
      userID: user,
    };
    members.push(userData);
  });

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
app.post("/showInvitationStatus", (req, res) => {
  Community.findOne({ _id: req.body.community_id })
    .populate("sentInvitesTo.userID", ["userIDSQL", "name"])
    .then(async (result) => {
      let data = {};
      data.sentInvitesTo = JSON.parse(JSON.stringify(result.sentInvitesTo));
      let users = [];
      for (let i = 0; i < result.sentInvitesTo.length; i++) {
        users.push(result.sentInvitesTo[i]._id);
      }

      result.sentInvitesTo.forEach((sentInvite) => {
        users.push(sentInvite.userID._id);
      });

      result.listOfUsers.forEach((user) => {
        users.push(user.userID._id);
      });

      data.listOfInvolvedUsers = users;

      res.status(200).send(data);
      // res.status(200).send(data.sentInvitesTo);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/getCommunitiesCreatedByMe", (req, res) => {
  Community.find({ ownerID: req.body.user_id }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      let communities = [];
      result.forEach((element) => {
        let communityDetails = {
          communityName: element.communityName,
          communityID: element._id,
        };
        communities.push(communityDetails);
      });
      res.status(200).send(communities);
    }
  });
});
module.exports = router;
