const db = require("../models/sql");

let handle_request = (msg, callback) => {
  db.Topic.findAll()
    .then(topic => {
      if (topic === null) {
        callback("No Topic", null);
      } else {
        callback(null, topic);
      }
    })
    .catch(err => {
      callback(err, null);
    });
};

exports.handle_request = handle_request;
