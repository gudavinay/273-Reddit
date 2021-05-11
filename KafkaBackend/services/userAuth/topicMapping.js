"use strict";
const { login } = require("./login");
const { signUp } = require("./signUp");

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Login":
      login(msg, callback);
      break;
    case "SignUp":
      signUp(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
