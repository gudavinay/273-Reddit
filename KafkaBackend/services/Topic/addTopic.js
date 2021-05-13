const db = require("../../models/sql");

const addTopic = async (msg, callback) => {
  console.log("calling db");

  db.Topic.create({
    topic: msg.name,
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

exports.addTopic = addTopic;
