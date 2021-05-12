const Post = require("../../models/mongo/Post");
const Community = require("../../models/mongo/Community");

const createPost = async (msg, callback) => {
  let data = {},
    res = {};
  console.log("create post msg = ", msg);
  if (msg.type == 0) {
    data = {
      communityID: msg.community_id,
      type: msg.type,
      title: msg.title,
      description: msg.description,
      userID: msg.user_id
    };
  } else if (msg.type == 1) {
    data = {
      communityID: msg.community_id,
      type: msg.type,
      title: msg.title,
      link: msg.link,
      userID: msg.user_id
    };
  } else if (msg.type == 2) {
    data = {
      communityID: msg.community_id,
      type: msg.type,
      title: msg.title,
      postImageUrl: msg.postImageUrl,
      userID: msg.user_id
    };
  }
  new Post(data).save((err, result) => {
    if (err) {
      res.status = 500;
      callback(null, res);
    }

    res.data = result;
    res.status = 200;
    Community.findOneAndUpdate(
      { _id: msg.community_id },
      { $inc: { NoOfPost: 1 } },
      (err, result) => {
        if (result) {
          callback(null, res);
        }
      }
    );

    // Community.updateOne(
    //   { _id: msg.community_id },
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
};

exports.createPost = createPost;
