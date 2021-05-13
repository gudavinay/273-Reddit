"use strict";
const { addTopic } = require("./addTopic");
const { editTopic } = require("./editTopic");
const { deleteTopic } = require("./deleteTopic");

let handle_request = (msg, callback) => {
  if (msg.path === "addTopic") {
    addTopic(msg, callback);
  } else if (msg.path === "editTopic") {
    editTopic(msg, callback);
  } else if (msg.path === "deleteTopic") {
    deleteTopic(msg, callback);
  }
};

exports.handle_request = handle_request;
