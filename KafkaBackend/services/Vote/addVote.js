const Vote = require("../../models/mongo/vote");

const addVote = async (msg, callback) => {
  res = {};
  console.log(msg);

  console.log("add vote = req = ", msg.body);
  const { userId, voteDir, entityId } = msg.body;
  if (voteDir == 0) {
    console.log("delete document");
    Vote.findOneAndDelete(
      { entityId: entityId, userId: userId },
      (err, result) => {
        if (err) {
          res.status = 500;
          callback(null, res);
          //   res.status(500).send(err);
        } else {
          res.data = result;
          res.status = 200;
          callback(null, res);
          res.status(200).send(result);
        }
      }
    );
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
      { entityId: entityId, userId: userId },
      query,
      options,
      (err, result) => {
        if (err) {
          console.log("cant find document");
          res.status = 500;
          callback(null, res);
          //   res.status(500).send(err);
        } else {
          res.data = result;
          res.status = 200;
          callback(null, res);
          //   res.status(200).send(result);
        }
      }
    );
  }
};

exports.addVote = addVote;
