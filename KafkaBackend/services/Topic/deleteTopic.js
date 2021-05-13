const db = require("../../models/sql");

const deleteTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.destroy({
    where: {
      topic_id: msg.topic_id,
    },
  })
    .then((topic) => {
      console.log(topic);
      callback(null, "delete");
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.deleteTopic = deleteTopic;
