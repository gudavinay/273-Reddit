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

app.get("/getMessage", async (req, res) => {
  console.log("Inside get message");
  const getMessage = await db.Message.findAll({
    where: {
      [Op.or]: [{ sent_by: req.body.user_id }, { sent_to: req.body.user_id }]
    }
  });
  if (getMessage.length > 0) {
    res.status(200).send(getMessage);
  } else {
    res.status(500).send("No message found");
  }
});

module.exports = router;
