var connection = new require("./kafka/connection");
//const messageSQL = require("./services/Message/message_sql");
const message = require("./services/message/topicMapping");
const user_info = require("./services/userSQL/topicMapping");
const jwt_auth = require("./services/jwt_auth");

const search_mongo = require("./services/search_mongo");

const user_mongo = require("./services/userMongo/topicMapping");
const userAuth_sql = require("./services/userAuth/topicMapping");
const vote_mongo = require("./services/Vote/topicMapping");
const community_mongo = require("./services/community/topicMapping");
const manage_community = require("./services/community/manageCommunity/topicMapping");
const community_analytics = require("./services/community/communityAnalytics/topicMapping");
const getTopic = require("./services/getTopic");

require("./dbConnection");
const sqldb = require("./models/sql");
sqldb.sequelize.sync().then(() => {
  console.log("sequelize is running");
});

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("Kafka Server is running ");
  consumer.on("message", function (message) {
    console.log("Message received for " + topic_name);
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("HANDLED", err, res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        console.log("payload sent:", data);
      });
      return;
    });
  });
}

handleTopicRequest("sql_message", message);
handleTopicRequest("JWT_auth", jwt_auth);
handleTopicRequest("mongo_user", user_mongo);
handleTopicRequest("sql_user_auth", userAuth_sql);
handleTopicRequest("search_mongo", search_mongo);
handleTopicRequest("mongo_community", community_mongo);
handleTopicRequest("user_info", user_info);
handleTopicRequest("manage_community", manage_community);
handleTopicRequest("community_analytics", community_analytics);
handleTopicRequest("get_topic", getTopic);
// handleTopicRequest("vote_mongo", vote_mongo);
