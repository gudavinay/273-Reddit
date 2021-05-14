const Vote = require("../../models/mongo/vote");

const getVote = async (msg, callback) => {
  res = {};
  const userId = msg.entityId;

  //   Vote.find({ userId: userId })
  //     .then((result) => {
  //       console.log("result = ", result);
  //       res.data = result;
  //       res.status = 200;
  //       callback(null, res);
  //     })
  //     .catch((err) => {
  //       res.status = 500;
  //       callback(null, res);
  //     });
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
        res.status = 500;
        callback(null, res);
      } else {
        const res1 = result.filter((eId) => {
          return JSON.stringify(eId._id) === JSON.stringify(entityId);
        });
        res1[0]["entityId"] = res1[0]["_id"];
        delete res1[0]["_id"];
        res.data = res1[0];
        res.status = 200;
        callback(null, res);
      }
    }
  );
};

exports.getVote = getVote;
