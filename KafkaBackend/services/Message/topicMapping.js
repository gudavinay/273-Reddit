"use strict";
const { sendMessage } = require("./sendMessage");
const { getUsersChattedInfo } = require("./getUsersChattedInfo");
const { getMessage } = require("./getMessage");
const { getMessageForTest } = require("./message_sql");

let handle_request = (msg, callback) => {
  switch (msg.path) {
    case "Get-Message-For-Test":
      getMessageForTest(msg, callback);
      break;
    case "Send-Message":
      sendMessage(msg, callback);
      break;
    case "Get-UserName-Chatted":
      getUsersChattedInfo(msg, callback);
      break;
    case "Get-Message-Between-User":
      getMessage(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
