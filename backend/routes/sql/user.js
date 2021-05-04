const express = require("express");
const app = require("../../app");
const router = express.Router();
const db = require("../../models/sql");
const { auth } = require("../../Util/passport");
const { Op } = require("sequelize");
auth();

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

app.post("/getListedUserDetails", async (req, res) => {
  console.log(req.body.usersList);
  const result = await db.User.findAll({
    attributes: ["user_id", "name", "profile_picture_url"],
    where: { user_id: { [Op.in]: req.body.usersList } },
  });
  console.log(result);
  if (result.length > 0) {
    return res.status(200).send(result);
  } else {
    return res.status(400).end();
  }
});

function createToken(user) {
  const payload = { id: user.user_id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000,
  });
}
module.exports = router;
