"use strict";
const { comment } = require("./comment");
const { getCommentsWithPostID } = require('./getCommentsWithPostID');

let handle_request = (msg, callback) => {
  if (msg.path === "comment") {
    comment(msg, callback);
  } else if (msg.path === "getCommentsWithPostID") {
    getCommentsWithPostID(msg, callback);
  }
};

exports.handle_request = handle_request;
