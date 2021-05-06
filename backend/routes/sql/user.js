const express = require("express");
const app = require("../../app");
const router = express.Router();
const db = require("../../models/sql");
const { auth } = require("../../Util/passport");
const { Op } = require("sequelize");

app.post("/getSearchedUser", async (req, res) => {
  const findUser = await db.User.findAll({
    attributes: ["user_id", "name"],
    where: {
      name: {
        [Op.startsWith]: req.body.name,
      },
    },
  });
  if (findUser.length > 0) {
    return res.status(200).send(findUser);
  } else {
    return res.status(500).send("No User Found");
  }
});

module.exports = router;
