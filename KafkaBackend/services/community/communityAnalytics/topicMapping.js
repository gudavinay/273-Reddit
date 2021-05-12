"use strict";
const { postUserAnalytics } = require("./postUserAnalytics");

let handle_request = (msg, callback) => {
  if (msg.path === "Community-Analytics") {
    postUserAnalytics(msg, callback);
  }
};

exports.handle_request = handle_request;
