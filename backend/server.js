const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const { frontEnd } = require("./Util/config");

//require express session
const session = require("express-session");

// use session to store user data between HTTP requests
app.use(session({
    secret              : "cmpe273_kafka_passport_mongo",
    resave              : false,
    saveUninitialized   : true,
    duration            : 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      : 5 * 60 * 1000
}));

app.set("view engine", "ejs");

// use cors to allow cross origin resource sharing
app.use(cors({
    origin        : frontEnd,
    credentials   : true
}));

// Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", frontEnd);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Cache-Control", "no-cache");
  next();
});

app.listen(port, () => {
  console.log("App is listening to 8000");
});

module.exports = app;
