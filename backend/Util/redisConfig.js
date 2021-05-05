const redis = require("redis");

const { redisPort, redisHost, redisPass } = require("./config");

const redisClient = redis.createClient({
  host: redisHost,
  no_ready_check: true,
  auth_pass: redisPass
});

redisClient.on("connect", err => {
  if (err) console.log("Error while connecting to redis");
  else console.log("Redis server connected");
});

module.exports = redisClient;
