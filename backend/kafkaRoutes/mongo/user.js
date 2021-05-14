const express = require("express");
const router = express.Router();
const app = require("../../app");
const kafka = require("../../kafka/client");
const { checkAuth } = require("./../../Util/passport");

app.get("/getUserProfile", (req, res) => {
  console.log("mongo", req.query);
  req.body.ID = req.query.ID;
  req.body.path = "Get-User-Profile";
  kafka.make_request("mongo_user", req.body, (error, result) => {
    if (result.status === 200) {
      return res.status(200).send(result.data);
    }
    return res.status(500).send("Error Occureed");
  });
});

app.get("/getUserDetails/:user_id", checkAuth, (req, res) => {
  try {
    const { user_id } = req.params;
    kafka.make_request(
      "mongo_user",
      {
        user_id,
        loggedInUserId: req.user.user_id,
        path: "GET-USER-DETAILS-BY-ID",
      },
      (error, result) => {
        if (result?.status === 200) {
          return res.status(200).send(result.data);
        }
        return res.status(500).send(error?.message || result.message);
      }
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/createUserProfile", (req, res) => {
  req.body.path = "Create-User-Profile";
  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(JSON.stringify(result));
    }
    return res.status(500).send(error);
  });
});

app.post("/getSearchedUserForMongo", async (req, res) => {
  req.body.path = "Get-Searched-User-For-Mongo";
  req.body.name = req.body.name;
  req.body.users = req.body.users;
  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/getNotificationData", (req, res) => {
  req.body.path = "Get-Notification-Data";
  req.body.user_id = req.body.user_id;

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/acceptInvite", (req, res) => {
  (req.body.user_id = req.body.user_id),
    (req.body.community_id = req.body.community_id);
  req.body.path = "Accept-Invite-As-User";

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/rejectInvite", (req, res) => {
  console.log("reject called backend");
  (req.body.user_id = req.body.user_id),
    (req.body.community_id = req.body.community_id);
  req.body.path = "Reject-Invite-As-User";

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.get("/getUserProfileByMongoID", (req, res) => {
  req.body.ID = req.query.ID;
  req.body.path = "Get-User-Profile-By-MongoID";

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/RequestedUsersForCom", async (req, res) => {
  // console.log(req.body.usersList);
  req.body.path = "Requested-Users-For-Com";
  req.body.userList = req.body.userList;

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/getListedUserDetails", async (req, res) => {
  req.body.page = req.body.page;
  req.body.size = req.body.size;
  req.body.usersList = req.body.usersList;
  req.body.search = req.body.search;
  req.body.path = "Get-Listed-User-Details";

  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});

app.post("/updateUserProfile", async (req, res) => {
  req.body.path = "updateUserProfile";
  kafka.make_request("mongo_user", req.body, (error, result) => {
    console.log(result);
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(500).send(error);
  });
});
module.exports = router;
