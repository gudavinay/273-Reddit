const express = require("express");
require("dotenv/config");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 8000;
const { mongoURI, frontEnd } = require("./Util/config");
const mongoose = require("mongoose");

//app.use(express.static("uploads"));
const multer = require("multer"); //upload image on server
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const s3 = new AWS.S3();

//require express session
var session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
//use session to store user data between HTTP requests
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "splitwiseimage",
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now() + file.originalname); //use Date.now() for unique file keys
    }
  })
}).single("file");

app.set("view engine", "ejs");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0
};

mongoose.connect(mongoURI, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
});

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: frontEnd,
    credentials: true
  })
);
app.use(bodyParser.json());
//Allow Access Control
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

const User = require("./routes/User");

app.use("/user", User);

app.listen(port, () => {
  console.log("App is listening to 8000");
});

app.post("/upload", (req, res, next) => {
  upload(req, res, error => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(req.file.location);
    }
  });
});
module.exports = app;
