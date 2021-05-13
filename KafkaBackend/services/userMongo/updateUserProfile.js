const UserProfile = require("../../models/mongo/UserProfile");

const updateUserProfile = async (msg, callback) => {
    UserProfile.updateOne({ _id: msg.id }, msg, { new: true }).then(result => {
        callback(null, result)
    }).catch(err => {
        console.log(err);
        callback(null, 'Internal Server Error.');
    });
};

exports.updateUserProfile = updateUserProfile;
