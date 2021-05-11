"use strict";
const { addVote } = require("./addVote");
const { getVote } = require("./getVote");

let handle_request = (msg, callback) => {
  if (msg.path === "addVote") {
    addVote(msg, callback);
  } else if (msg.path === "getVote") {
    getVote(msg, callback);
  }
};

exports.handle_request = handle_request;
