var express = require("express");
const app = require("../../app");
const router = express.Router();
const Community = require("../../models/mongo/Community");
const Vote = require("../../models/mongo/Vote");
const User = require("../../models/mongo/UserProfile");

app.post("/addVote", (req, res) => {
  const { userId, voteDir, entityId } = req.body;
  if (voteDir == 0) {
    console.log("delete document");
    Vote.findOneAndDelete({ _id: entityId }, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  } else {
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };
    const query = {
      $set: {
        entityId: entityId,
        userId: userId,
        voteDir: voteDir,
      },
    };
    Vote.findOneAndUpdate(
      { entityId: entityId },
      query,
      options,
      (err, result) => {
        if (err) {
          console.log("cant find document");
          res.status(500).send(err);
        } else {
          res.status(200).send(result);
        }
      }
    );
  }
});

app.get("/getVote", (req, res) => {
  const entityId = req.query.entityId;

  Vote.aggregate(
    [
      {
        $group: {
          _id: "$entityId",
          upvoteCount: {
            $sum: { $cond: { if: { $eq: ["$voteDir", 1] }, then: 1, else: 0 } },
          },
          downvoteCount: {
            $sum: {
              $cond: { if: { $eq: ["$voteDir", -1] }, then: 1, else: 0 },
            },
          },
        },
      },
    ],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const res1 = result.filter((eId) => {
          return JSON.stringify(eId._id) === JSON.stringify(entityId);
        });
        res1[0]["entityId"] = res1[0]["_id"];
        delete res1[0]["_id"];
        res.status(200).send(res1[0]);
        console.log("result - ", res1);
      }
    }
  );
});

module.exports = router;
