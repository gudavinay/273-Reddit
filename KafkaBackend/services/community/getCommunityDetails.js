const Community = require("../../models/mongo/Community");

const getCommunityDetails = async (msg, callback) => {
    let res = {};
    await Community.findOne({ _id: msg.query.ID })
        .populate("listOfUsers.userID")
        .then((result) => {
            res.data = result;
            res.status = 200;
            callback(null, res);
        })
        .catch((err) => {
            res.status = 500;
            callback(null, res);
        });
};

exports.getCommunityDetails = getCommunityDetails;
