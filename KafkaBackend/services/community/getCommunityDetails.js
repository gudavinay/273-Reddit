const Community = require("../../models/mongo/Community");

const getCommunityDetails = async (msg, callback) => {
    let res = {};
    if (msg.query.requirePopulate) {
        await Community.findOne({ _id: msg.query.ID })
            .populate("listOfUsers.userID")
            .populate("ownerID")
            .then((result) => {
                res.data = result;
                res.status = 200;
                callback(null, res);
            })
            .catch((err) => {
                res.status = 500;
                callback(null, res);
            });
    } else {
        await Community.findOne({ _id: msg.query.ID })
            // .populate("listOfUsers.userID")
            .then((result) => {
                res.data = result;
                res.status = 200;
                callback(null, res);
            })
            .catch((err) => {
                res.status = 500;
                callback(null, res);
            });
    }

};

exports.getCommunityDetails = getCommunityDetails;
