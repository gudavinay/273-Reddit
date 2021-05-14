const Vote = require("../../models/mongo/vote");
const Post = require("../../models/mongo/Post");
const Comment = require("../../models/mongo/Comment");
const Community = require("../../models/mongo/Community");

const addVote = async (msg, callback) => {
  res = {};
  console.log(msg);
  console.log("add vote = req = ", msg);
  const { userId, voteDir, entityId, relScore, entityName } = msg;
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
          if (entityName === "Post") {
            Post.findById(entityId, (err, pst) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("pst = ", pst);
                pst.score = pst.score + relScore;
                pst.upvotedBy.pull(userId);
                pst.downvotedBy.pull(userId);
                pst.save((err, updatePost) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated post = ", updatePost);
                });
              }
            });
          } else if (entityName == "Comment") {
            Comment.findById(entityId, (err, cmt) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("cmt = ", cmt);
                cmt.score = cmt.score + relScore;
                cmt.upvotedBy.pull(userId);
                cmt.downvotedBy.pull(userId);
                cmt.save((err, updateComment) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated comment = ", updateComment);
                });
              }
            });
          } else if (entityName == "Community") {
            Community.findById(entityId, (err, commty) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("commmty = ", commty);
                commty.score = commty.score + relScore;
                commty.upvotedBy.pull(userId);
                commty.downvotedBy.pull(userId);
                commty.save((err, updateCommunity) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated comment = ", updateCommunity);
                });
              }
            });
          }
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
          if (entityName == "Post") {
            Post.findById(entityId, (err, pst) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("pst = ", pst);
                pst.score = pst.score + relScore;
                if (voteDir == -1) {
                  pst.upvotedBy.pull(userId);
                  pst.downvotedBy.push(userId);
                } else {
                  pst.upvotedBy.push(userId);
                  pst.downvotedBy.pull(userId);
                }
                pst.save((err, updatePost) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated post = ", updatePost);
                });
              }
            });
          } else if (entityName == "Comment") {
            Comment.findById(entityId, (err, cmt) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("cmt = ", cmt);
                cmt.score = cmt.score + relScore;
                if (voteDir == -1) {
                  cmt.upvotedBy.pull(userId);
                  cmt.downvotedBy.push(userId);
                } else {
                  cmt.upvotedBy.push(userId);
                  cmt.downvotedBy.pull(userId);
                }
                cmt.save((err, updateComment) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated Comment = ", updateComment);
                });
              }
            });
          } else if (entityName == "Community") {
            Community.findById(entityId, (err, commty) => {
              if (err) {
                res.status = 500;
                callback(null, res);
              } else {
                console.log("commty = ", commty);
                commty.score = commty.score + relScore;
                if (voteDir == -1) {
                  commty.upvotedBy.pull(userId);
                  commty.downvotedBy.push(userId);
                } else {
                  commty.upvotedBy.push(userId);
                  commty.downvotedBy.pull(userId);
                }
                commty.save((err, updateCommunity) => {
                  if (err) {
                    res.status = 500;
                    callback(null, res);
                  } else {
                    res.data = result;
                    res.status = 200;
                    callback(null, res);
                  }
                  console.log("updated Community = ", updateCommunity);
                });
              }
            });
          }

          //   res.status(200).send(result);
        }
      }
    );
  }
};

exports.addVote = addVote;
