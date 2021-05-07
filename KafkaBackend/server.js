var connection = new require("./kafka/connection");
const messageSQL = require("./routes/messageSQL");

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
        console.log(data);
      });
      return;
    });
  });
}

handleTopicRequest("msgSQL", messageSQL);
