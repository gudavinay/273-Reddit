"use strict";
const { postUserAnalytics } = require("./postUserAnalytics");

let handle_request = (msg, callback) => {
  if (msg.path === "Post-Analytics") {
    postUserAnalytics(msg, callback);
  }
};

exports.handle_request = handle_request;
