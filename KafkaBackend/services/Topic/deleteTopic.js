const db = require("../../models/sql");

const deleteTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.delete({
    topic_id: msg.topic_id,
  })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.deleteTopic = deleteTopic;
