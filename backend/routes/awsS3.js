const express = require("express");
const router = express.Router();
const app = require("../app");
const multer = require("multer"); //upload image on server
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const {
  AWSAccessKeyId,
  AWSSecretKey,
  AWSBucketName
} = require("../Util/config");

var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  }
});

var multipleUpload = multer({ storage: storage }).array("file"); //can be used for multiple record
var upload = multer({ storage: storage }).single("file"); //can be used for single record

app.post("/upload", multipleUpload, function (req, res) {
  const file = req.files;
  let s3bucket = new AWS.S3({
    accessKeyId: AWSAccessKeyId,
    secretAccessKey: AWSSecretKey,
    Bucket: AWSBucketName
  });
  s3bucket.createBucket(function () {
    //Where you want to store your file
    var ResponseData = [];

    file.map(item => {
      var params = {
        Bucket: AWSBucketName,
        Key: item.originalname,
        Body: item.buffer,
        ACL: "public-read"
      };
      s3bucket.upload(params, function (err, data) {
        if (err) {
          res.status(500).send(err);
        } else {
          ResponseData.push(data);
          if (ResponseData.length == file.length) {
            res.status(200).send(ResponseData);
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
