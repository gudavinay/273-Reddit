const mongoose = require("mongoose");
const Community = require("./../models/mongo/Community");
const UserProfile = require("./../models/mongo/UserProfile");

const getAllCommunitiesSearch = async (msg, callback) => {
  try {
    const { sortKey, sortValue, limit, page, searchText, user_id, loggedInUserId } = msg;

    const loggedInUser = await UserProfile.findOne({
      userIDSQL: loggedInUserId,
    });

    const aggregate = Community.aggregate([
      {
        $match: {
          communityName: { $regex: searchText, $options: "i" },
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
        "$addFields": {
          "listOfUsersLength": {
            "$reduce": {
              "input": "$listOfUsers",
              "initialValue": 0,
              "in": { "$add": ["$$value", "$$this.isAccepted"] }
            }
          }
        }
      },
      {
        $project: {
          communityName: "$communityName",
          communityDescription: "$communityDescription",
          ownerID: "$ownerID",
          imageURL: "$imageURL",
          createdAt: "$createdAt",
          postsLength: { $size: "$posts" },
          listOfUsersLength: { "$add": ["$listOfUsersLength", 1] }, // Adding +1 means Owner
          upVotedLength: { $size: "$upvotedBy" },
          downVotedLength: { $size: "$downvotedBy" },
          score: {
            $subtract: [{ $size: "$upvotedBy" }, { $size: "$downvotedBy" }],
          },
          userVoteDir: {
            $cond: {
              if: {
                $setIsSubset: [
                  [{ _id: mongoose.Types.ObjectId(loggedInUser._id) }],
                  "$upvotedBy",
                ],
              },
              then: 1,
              else: {
                $cond: {
                  if: {
                    $setIsSubset: [
                      [{ _id: mongoose.Types.ObjectId(loggedInUser._id) }],
                      "$downvotedBy",
                    ],
                  },
                  then: -1,
                  else: 0,
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          [sortKey]: sortValue.toLowerCase() === "desc" ? -1 : 1,
          _id: -1,
        },
      },
    ]);

    const communities = await Community.aggregatePaginate(aggregate, {
      page,
      limit,
    });

    communities.docs = await Community.populate(communities.docs, "ownerID");

    callback(null, {
      status: 200,
      data: {
        communities,
      },
    });
  } catch (e) {
    callback(e, { status: 500, message: e.message });
  }
};

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Get-All-Communities-Search":
      getAllCommunitiesSearch(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
