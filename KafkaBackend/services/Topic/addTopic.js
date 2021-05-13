const db = require("../../models/sql");

const addTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.create({
    topic: msg.name,
  })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err, null);
    });
};

exports.addTopic = addTopic;
