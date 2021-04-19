var express = require("express");
const router = express.Router();
const { auth } = require("../Utils/passport");
auth();
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signupUser", async (req, res) => {
  kafka.make_request("signupUser", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Registered");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

function createToken(user) {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000
  });
  return "JWT " + token;
}

module.exports = router;
