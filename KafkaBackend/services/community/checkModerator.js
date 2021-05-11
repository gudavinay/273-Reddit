const Community = require("../../models/mongo/Community");

const checkModerator = async (msg, callback) => {
  Community.find({ ownerID: msg.user_id })
    .then((result) => {
      let Communities = {
        length: result.length,
      };
      callback(null, Communities);
    })
    .catch((error) => {
      callback(error, null);
    });
};

exports.checkModerator = checkModerator;
