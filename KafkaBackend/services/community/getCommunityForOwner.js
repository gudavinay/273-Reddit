const Community = require("../../models/mongo/Community");

const getCommunitiesForOwner = async (msg, callback) => {
  res = {};
  console.log(msg);
  let skip = Number(msg.page) * Number(msg.size);
  let count = await Community.countDocuments({
    $and: [{ ownerID: msg.ID }, { communityName: { $regex: msg.search } }]
  });

  await Community.find({
    $and: [
      { ownerID: msg.ID },
      { communityName: { $regex: msg.search, $options: "i" } }
    ]
  })
    .populate("listOfUsers.userID")
    .limit(Number(msg.size))
    .skip(skip)
    .sort({ createdAt: 1 })
    .then(result => {
      let output = [];
      result.forEach(item => {
        let usersIdOfSQL = [];
        let acceptedIdOfSQL = [];
        for (let i = 0; i < item.listOfUsers.length; i++) {
          if (!item.listOfUsers[i].isAccepted) {
            usersIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
          } else {
            acceptedIdOfSQL.push(item.listOfUsers[i].userID.userIDSQL);
          }
        }
        let data = JSON.parse(JSON.stringify(item));
        data.requestedUserSQLIds = usersIdOfSQL;
        data.acceptedUsersSQLIds = acceptedIdOfSQL;
        data.NoOfPost = item.NoOfPost;
        delete data.listOfUsers;
        delete data.upvotedBy;
        delete data.downvotedBy;
        delete data.sentInvitesTo;
        delete data.rules;
        delete data.topicSelected;
        output.push(data);
      });
      res.data = { com: output, total: count };
      res.status = 200;
      callback(null, res);
    });
  res.status = 500;
  callback(null, res);
};

exports.getCommunitiesForOwner = getCommunitiesForOwner;
