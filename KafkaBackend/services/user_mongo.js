const mongoose = require("mongoose");
const redisClient = require("./../Util/redisConfig");
const UserProfile = require("./../models/mongo/UserProfile");
const Community = require("./../models/mongo/Community");

const getUserProfile = async (msg, callback) => {
  let res = {};
  redisClient.get(msg.ID, async (err, userProfile) => {
    if (userProfile) {
      res.data = userProfile;
      res.status = 200;
      callback(null, res);
    } else {
      UserProfile.find({ userIDSQL: msg.ID }).then((result, error) => {
        if (error) {
          res.data = userProfile;
          res.status = 500;
          callback(null, res);
        } else {
          if (result.length > 0) {
            redisClient.setex(msg.ID, 36000, JSON.stringify(result));
          }
          res.data = result;
          res.status = 200;
          callback(null, res);
        }
      });
    }
  });
};

const getUserDetailsById = async (msg, callback) => {
  try {
    const { user_id } = msg;

    const user = await UserProfile.findOne({
      userIDSQL: user_id,
    });
    if (!user) {
      throw new Error(`User Not Found`);
    }

    let user_communities = await Community.aggregate([
      {
        $match: {
          $or: [
            {
              listOfUsers: {
                $elemMatch: { userID: user._id, isAccepted: true },
              },
            },
            {
              ownerID: mongoose.Types.ObjectId(
                user._id
              )
            }
          ]
        },
      },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "entityId",
          as: "vote",
        },
      },
      { $unwind: { path: "$vote", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          communityName: { $first: "$communityName" },
          communityDescription: { $first: "$communityDescription" },
          ownerID: { $first: "$ownerID" },
          imageURL: { $first: "$imageURL" },
          createdAt: { $first: "$createdAt" },
          posts: { $first: "$posts" },
          listOfUsers: { $first: "$listOfUsers" },
          upvoteCount: {
            $sum: {
              $cond: { if: { $eq: ["$vote.voteDir", 1] }, then: 1, else: 0 },
            },
          },
          downvoteCount: {
            $sum: {
              $cond: { if: { $eq: ["$vote.voteDir", -1] }, then: 1, else: 0 },
            },
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "communityID",
          as: "posts",
        },
      },
      {
        $project: {
          communityName: "$communityName",
          communityDescription: "$communityDescription",
          ownerID: "$ownerID",
          imageURL: "$imageURL",
          createdAt: "$createdAt",
          postsLength: { $size: "$posts" },
          listOfUsersLength: { $size: "$listOfUsers" },
          upVotedLength: "$upvoteCount",
          downVotedLength: "$downvoteCount",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    user_communities = await Community.populate(user_communities, "ownerID");

    callback(null, {
      status: 200, data: {
        user,
        user_communities,
      }
    });
  } catch (e) {
    callback(e, { status: 500, message: e.message });
  }
}

handle_request = (msg, callback) => {
  if (msg.path === "Get-User-Profile") {
    getUserProfile(msg, callback);
  } else if (msg.path === "GET-USER-DETAILS-BY-ID") {
    getUserDetailsById(msg, callback);
  }
};

exports.handle_request = handle_request;
