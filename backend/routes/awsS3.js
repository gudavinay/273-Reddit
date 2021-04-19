//app.use(express.static("uploads"));
require("dotenv/config");
const multer = require("multer"); //upload image on server
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
});

const s3 = new AWS.S3();

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

app.post("/upload", (req, res, next) => {
    upload(req, res, error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(req.file.location);
        }
    });
});