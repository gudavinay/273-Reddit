const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const { frontEnd } = require("./Util/config");
// DB connection
require("./dbConnection");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const session = require("express-session");

// use session to store user data between HTTP requests
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

app.set("view engine", "ejs");

// use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: frontEnd,
    credentials: true
  })
);

// Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", frontEnd);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Mongo Router
const mongoRouter = require("./routes/mongo/router");
app.use("/mongoRouter", mongoRouter);

const UserProfile = require("./models/mongo/user_profile");
app.get("/", (req, res) => {
  const up = new UserProfile({ email: "test@test.com" });
  up.save();
  res.send("Hello World");
});

const userRouter = require("./routes/sql/user");
app.use("/userRouter", userRouter);
// SQL router
const sqlRouter = require("./routes/sql/router");
const sqldb = require("./models/sql");
app.use("/sqlRouter", sqlRouter);
sqldb.sequelize.sync().then(() => {
  console.log("sequelize is running");
});

app.listen(port, () => {
  console.log("App is listening to 3001");
});

module.exports = app;
