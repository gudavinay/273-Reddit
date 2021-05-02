const redis = require("redis");

const { redisPort, redisHost } = require("./config");

const redisClient = redis.createClient(redisPort, redisHost);

redisClient.on("connect", err => {
  if (err) console.log("Error while connecting to redis");
  else console.log("Redis server connected");
});

module.exports = redisClient;
