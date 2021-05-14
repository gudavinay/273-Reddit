const Post = require("../../../models/mongo/Post");
const Community = require("../../../models/mongo/Community");

const getUsersWithMorePostsForCommunities = async (msg, callback) => {
  console.log(msg);
  Community.find({ ownerID: msg.ID }, "_id ownerID communityName", {
    sort: { createdAt: 1 },
  }).then(async (result, error) => {
    if (error) {
      callback(error, null);
    } else {
      let postList = [];
      let userList = [];
      await Promise.all(
        result.map(async (item) => {
          console.log(item);
          await Post.findOne(
            { communityID: item._id },
            "_id userID title score NoOfComments communityID",
            { sort: { score: -1, createdAt: -1 } }
          )
            .then((result) => {
              output = JSON.parse(JSON.stringify(result));
              output["communityName"] = item ? item.communityName : null;
              postList.push(output);
            })
            .catch((err) => {
              console.log(err);
            });
          await Post.aggregate([
            { $match: { communityID: item._id } },
            {
              $lookup: {
                from: "userprofiles",
                localField: "userID",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $lookup: {
                from: "communities",
                localField: "communityID",
                foreignField: "_id",
                as: "communityDetails",
              },
            },
            {
              $unwind: {
                path: "$userDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$communityDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: "$userID",
                count: { $sum: 1 },
                name: { $first: "$userDetails.name" },
                email: { $first: "$userDetails.email" },
                picture: { $first: "$userDetails.profile_picture_url" },
                communityName: { $first: "$communityDetails.communityName" },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 1 },
          ]).then((result2) => {
            userList.push(result2);
          });
        })
      );
      let data = {
        mostUpvotedPost: postList,
        userWithMaxPosts: userList,
      };
      console.log(data);
      callback(null, data);
    }
  });
};

exports.getUsersWithMorePostsForCommunities =
  getUsersWithMorePostsForCommunities;
