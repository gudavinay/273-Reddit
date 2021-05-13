const db = require("../../models/sql");

const editTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.update(
    {
      topic: msg.name,
    },
    {
      where: { topic_id: msg.topic_id },
    }
  )
    .then((topic) => {
      db.Topic.findAll({})
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error, null);
        });
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.editTopic = editTopic;
