const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const message = new mongoose.Schema(
  {
    Message: { type: String },
    sent_by: { type: Number },
    sent_to: { type: Number }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", message);
