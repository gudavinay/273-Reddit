"use strict";
const { createCommunity } = require("./createCommunity");
const { editCommunity } = require("./editCommunity");
const { deleteCommunity } = require("./deleteCommunity");
const { uniqueCommunity } = require("./checkForUniqueCommunity");

let handle_request = (msg, callback) => {
  if (msg.path === "Create-Community") {
    createCommunity(msg, callback);
  } else if (msg.path === "Edit-Community") {
    editCommunity(msg, callback);
  } else if (msg.path === "Delete-Community") {
    deleteCommunity(msg, callback);
  } else if (msg.path === "Unique-Community") {
    uniqueCommunity(msg, callback);
  }
};

exports.handle_request = handle_request;
