// var express = require("express");
// const app = require("../../app");
// const router = express.Router();
// const Community = require("../../models/mongo/Community");
// const Post = require("../../models/mongo/Post");
// const Comment = require("../../models/mongo/Comment");
// const Promise = require("bluebird");
//const redisClient = require("./../../Util/redisConfig");

// app.post("/addCommunity", function (req, res, next) {
//   let topicList = [];
//   req.body.selectedTopic.map((topic) => {
//     topicList.push({
//       topic: topic.topic,
//     });
//   });
//   let community = new Community({
//     communityName: req.body.communityName,
//     communityDescription: req.body.communityDescription,
//     ownerID: req.body.ownerID,
//     topicSelected: topicList,
//     imageURL: req.body.communityImages,
//     rules: req.body.listOfRules,
//   });
//   community.save((error, data) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Error Occured");
//     } else {
//       console.log(JSON.stringify(data));
//       // redisClient.setex(data._id, 36000, JSON.stringify(data));
//       res.status(200).send(JSON.stringify(data));
//     }
//   });
// });

// app.post("/editCommunity", async (req, res) => {
//   let topicList = [];
//   req.body.selectedTopic.map((topic) => {
//     topicList.push({
//       topic: topic.topic,
//     });
//   });
//   const filter = { _id: req.body.ID };
//   const updateDoc = {
//     $set: {
//       communityName: req.body.communityName,
//       communityDescription: req.body.communityDescription,
//       topicSelected: topicList,
//       imageURL: req.body.communityImages,
//       rules: req.body.listOfRules,
//     },
//   };
//   Community.updateOne(filter, updateDoc, (error, result) => {
//     if (error) {
//       res.status(500).send("Community is already registered");
//     } else {
//       res.status(200).send(result);
//     }
//   });
// });

// app.get("/myCommunity", async function (req, res) {
//   let data = [];
//   let { page, size, ID } = req.query;
//   let skip = 0;
//   if (page == 0) {
//     skip = 0;
//   } else {
//     skip = page * size;
//   }
//   const limit = parseInt(size);
//   const recordCount = await Community.count({ ownerID: ID });

//   Community.find({ ownerID: ID })
//     .sort({ createdAt: "desc" })
//     .limit(limit)
//     .skip(skip)
//     .then((result, error) => {
//       if (error) {
//         res.status(500).send("Error Occured");
//       } else {
//         if (result.length === 0) {
//           res.status(200).send(result);
//         }
//         const findResult = JSON.parse(JSON.stringify(result));
//         findResult.map((community) => {
//           Post.find({ communityID: community._id }).then(
//             (postResult, error) => {
//               data.push({
//                 _id: community._id,
//                 communityName: community.communityName,
//                 communityDescription: community.communityDescription,
//                 imageURL: community.imageURL,
//                 listOfUsers: community.listOfUsers,
//                 count: postResult.length,
//                 createdAt: community.createdAt,
//                 totalRecords: recordCount,
//               });
//               console.log(JSON.stringify(data));
//               if (result.length == data.length) {
//                 res.status(200).send(JSON.stringify(data));
//               }
//             }
//           );
//         });
//       }
//     });
// });

// app.get("/communityAnalystics", async function (req, res) {
//   let data = [];
//   Community.find({ ownerID: req.query.ID }).then((result, error) => {
//     if (error) {
//       res.status(500).send("Error Occured");
//     } else {
//       const findResult = JSON.parse(JSON.stringify(result));
//       findResult.map(community => {
//         Post.find({ communityID: community._id }).then((postResult, error) => {
//           data.push({
//             _id: community._id,
//             listOfUsers: community.listOfUsers,
//             count: postResult.length,
//             name: community.communityName
//           });
//           console.log(JSON.stringify(data));
//           if (result.length == data.length) {
//             res.status(200).send(JSON.stringify(data));
//           }
//         });
//       });
//     }
//   });
// });

// app.get("/getCommunityDetails", async (req, res) => {
//   await Community.findOne({ _id: req.query.ID }).then(result => {
//     res.status(200).send(result);
//   });
// });

// app.get("/getCommunitiesForOwner", async (req, res) => {
//   let skip = Number(req.query.page) * Number(req.query.size);
//   let count = await Community.countDocuments({
//     $and: [
//       { ownerID: req.query.ID },
//       { communityName: { $regex: req.query.search } }
//     ]
//   });
//   await Community.find({
//     $and: [
//       { ownerID: req.query.ID },
//       { communityName: { $regex: req.query.search, $options: "i" } }
//     ]
//   })
//     .populate("listOfUsers.userID")
//     .limit(Number(req.query.size))
//     .skip(skip)
//     .sort({ createdAt: 1 })
//     .then(result => {
//       let output = [];
//       result.forEach(item => {
//         let usersIdOfSQL = [];
//         let acceptedIdOfSQL = [];
//         for (let i = 0; i < item.listOfUsers.length; i++) {
//           if (!item.listOfUsers[i].isAccepted) {
//             usersIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
//           } else {
//             acceptedIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
//           }
//         }
//         let data = JSON.parse(JSON.stringify(item));
//         data.requestedUserSQLIds = usersIdOfSQL;
//         data.acceptedUsersSQLIds = acceptedIdOfSQL;
//         delete data.listOfUsers;
//         delete data.upvotedBy;
//         delete data.downvotedBy;
//         delete data.sentInvitesTo;
//         delete data.imageURL;
//         delete data.posts;
//         delete data.rules;
//         delete data.topicSelected;
//         output.push(data);
//       });
//       res.status(200).send({ com: output, total: count });
//     });
// });

// app.get("/getUsersForCommunitiesForOwner", (req, res) => {
//   Community.find({
//     ownerID: req.query.ID
//   })
//     .populate("listOfUsers.userID")
//     .then(result => {
//       let output = new Set();
//       result.forEach(item => {
//         item.listOfUsers.forEach(temp => {
//           if (temp.isAccepted) {
//             output.add(Number(temp.userID.userIDSQL));
//           }
//         });
//       });
//       res.status(200).send(Array.from(output));
//     });
// });

// app.post("/acceptUsersToCommunity", (req, res) => {
//   console.log(req.body);
//   try {
//     Promise.mapSeries(req.body.userList, (item) => {
//       console.log(item);
//       return Community.findOneAndUpdate(
//         {
//           _id: req.body.communityID,
//           "listOfUsers.userID": item,
//         },
//         { $set: { "listOfUsers.$.isAccepted": true } }
//       );
//     }).then(() => {
//       res.status(200).end();
//     });
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.post("/rejectUsersForCommunity", (req, res) => {
//   console.log(req.body);
//   try {
//     Promise.mapSeries(req.body.userList, (item) => {
//       return Community.findOneAndUpdate(
//         {
//           _id: req.body.communityID,
//           "listOfUsers.userID": item,
//         },
//         { $pull: { listOfUsers: { userID: item } } },
//         { useFindAndModify: false }
//       );
//     }).then(async () => {
//       res.status(200).end();
//     });
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.get("/getCommunitiesForUser", (req, res) => {
//   Community.find({ "listOfUsers.userID": req.query.ID }).then((result) => {
//     res.status(200).send(result);
//   });
// });

// app.post("/removeUserFromCommunities", (req, res) => {
//   console.log(req.body);
//   try {
//     Promise.mapSeries(req.body.commList, (item) => {
//       return Community.findOneAndUpdate(
//         {
//           _id: item,
//         },
//         { $pull: { listOfUsers: { userID: req.body.userID } } },
//         { useFindAndModify: false }
//       );
//     }).then(async () => {
//       await Post.deleteMany({
//         communityID: { $in: req.body.commList },
//         userID: req.body.userID,
//       });
//       await Comment.deleteMany({
//         communityID: { $in: req.body.commList },
//         userID: req.body.userID,
//       });
//       res.status(200).end();
//     });
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.post("/userJoinRequestToCommunity", (req, res) => {
//   console.log(req.body);
//   try {
//     Community.findOneAndUpdate(
//       { _id: req.body.community_id },
//       {
//         $push: { listOfUsers: [{ userID: req.body.user_id }] }
//       },
//       {
//         new: true
//       },
//       (err, result) => {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           res.status(200).send(result);
//         }
//       }
//     );
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.post("/userLeaveRequestFromCommunity", (req, res) => {
//   console.log(req.body);
//   try {
//     Community.findOneAndUpdate(
//       { _id: req.body.community_id },
//       {
//         $pull: { listOfUsers: { userID: req.body.user_id } }
//       },
//       {
//         new: true
//       },
//       (err, result) => {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           res.status(200).send(result);
//         }
//       }
//     );
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.post("/deleteCommunity", (req, res) => {
//   try {
//     Community.findOneAndDelete({ _id: req.body.community_id }).then(
//       async () => {
//         await Post.deleteMany({ communityID: req.body.community_id });
//         await Comment.deleteMany({ communityID: req.body.community_id });
//         res.status(200).end();
//       }
//     );
//   } catch (err) {
//     res.status(400).end();
//   }
// });

// app.post("/checkForUniqueCommunity", async function (req, res) {
//   await Community.find({
//     communityName: req.body.communityName
//   })
//     .then(result => {
//       if (result.length > 0) {
//         res.status(400).send("Community is already registered");
//       } else {
//         res.status(200).send();
//       }
//     })
//     .catch(err => {
//       res.status(500).send(err);
//     });
// });

module.exports = router;
