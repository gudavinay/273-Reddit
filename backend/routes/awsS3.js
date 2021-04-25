const express = require("express");
const router = express.Router();
const multer = require("multer"); //upload image on server
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const { AWSAccessKeyId, AWSSecretKey } = require("../Util/config");

// AWS.config.update({
//   accessKeyId: AWSAccessKeyId,
//   secretAccessKey: AWSSecretKey
// });

// const s3 = new AWS.S3();

// const storage = multerS3({
//   s3: s3,
//   acl: "public-read",
//   bucket: "splitwiseimage",
//   key: function (req, file, cb) {
//     console.log(file);
//     cb(null, Date.now() + file.originalname); //use Date.now() for unique file keys
//   }
// });

// var multipleUpload = multer({
//   storage: storage
// }).array("file");

// const upload = multer({
//   storage: storage
// }).single("file");

var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  }
});
var multipleUpload = multer({ storage: storage }).array("file");
router.post("/upload", multipleUpload, function (req, res) {
  const file = req.files;
  let s3bucket = new AWS.S3({
    accessKeyId: AWSAccessKeyId,
    secretAccessKey: AWSSecretKey,
    Bucket: "splitwiseimage"
  });
  s3bucket.createBucket(function () {
    let Bucket_Path = "BUCKET_PATH";
    //Where you want to store your file
    var ResponseData = [];

    file.map(item => {
      var params = {
        Bucket: BucketPath,
        Key: item.originalname,
        Body: item.buffer,
        ACL: "public-read"
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          res.json({ error: true, Message: err });
        } else {
          ResponseData.push(data);
          if (ResponseData.length == file.length) {
            res.json({
              error: false,
              Message: "File Uploaded    SuceesFully",
              Data: ResponseData
            });
          }
        }
      });
    });
  });
});

module.exports = router;

// app.post("/upload", multipleUpload, (req, res, next) => {
//   const file = req.files;

//   //   upload(req, res, error => {
//   //     if (error) {
//   //       res.status(500).send(error);
//   //     } else {
//   //       res.status(200).send(req.file.location);
//   //     }
//   //   });
// });
