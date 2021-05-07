const express = require("express");
const router = express.Router();
const app = require("../../app");
const db = require("../../models/sql");
const { Op } = require("sequelize");

app.post("/sendMessage", async (req, res) => {
  console.log("Inside send message");
  try {
    let message = await db.Message.create({
      message: req.body.message,
      sent_by: req.body.sent_by,
      sent_to: req.body.sent_to
    });
    return res.status(200).send(message);
  } catch (error) {
    console.log(error);
  }
});

app.get("/getMessageUserNames", async (req, res) => {
  console.log("Inside get message");
  const getMessage = await db.Message.findAll({
    attributes: ["sent_by", "sent_to"],
    group: ["sent_by", "sent_to"],
    where: {
      [Op.or]: [{ sent_by: req.query.ID }, { sent_to: req.query.ID }]
    },
    include: [
      {
        model: db.User,
        as: "sentByUser",
        attributes: ["user_id", "name", "email", "profile_picture_url"]
      },
      {
        model: db.User,
        as: "sentToUser",
        attributes: ["user_id", "name", "email", "profile_picture_url"]
      }
    ]
  });

  if (getMessage.length > 0) {
    res.status(200).send(getMessage);
  } else {
    res.status(500).send("No message found");
  }
});

app.get("/getMessage", async (req, res) => {
  console.log("Inside get message");
  const getMessage = await db.Message.findAll({
    where: {
      [Op.or]: [
        { sent_by: req.query.ID, sent_to: req.query.chatWith },
        { sent_by: req.query.chatWith, sent_to: req.query.ID }
      ]
    },
    order: [["createdAt", "ASC"]]
  });

  if (getMessage.length > 0) {
    res.status(200).send(getMessage);
  } else {
    res.status(500).send("No message found");
  }
});


app.get("/getMessageForTest", async (req, res) => {
  const getMessage = await db.Message.findAll({ sent_by: 53 });
  if (getMessage.length > 0) {
    res.status(200).send(getMessage);
  } else {
    res.status(500).send("No message found");
  }
});

module.exports = router;
