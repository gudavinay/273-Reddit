const { HOST } = require("../../global");
module.exports = {
  mongoURI:
    "mongodb+srv://reddit-user:reddit1234@reddit-cluster.vvqtv.mongodb.net/reddit-db",
  secret: "reddit_secret_key",
  frontEnd: "http://" + HOST + ":3000",
  port: 3001,
  SQLhost: "redditdb.cyazxyujehyt.us-west-2.rds.amazonaws.com",
  SQLusername: "admin",
  SQLpassword: "redditpass",
  SQLdb: "Reddit",
  AWSAccessKeyId: "AKIASA26GJPIL5JADT7I",
  AWSSecretKey: "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",
  AWSBucketName: "splitwiseimage",
  redisPort: 6379,
  redisHost: "54.85.111.171",
  redisPass: "secure-redis"
};
