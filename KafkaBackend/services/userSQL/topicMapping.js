"use strict";
const { searchUser } = require("./searchUser");

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Search-User":
      searchUser(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
