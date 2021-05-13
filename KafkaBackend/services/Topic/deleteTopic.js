const db = require("../../models/sql");

const deleteTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.destroy({
    where: {
      topic_id: msg.topic_id,
    },
  })
    .then((topic) => {
      db.Topic.findAll().then(result => {
        callback(null, result);
      }).catch(err => {
        callback(err, null);
      })
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.deleteTopic = deleteTopic;
