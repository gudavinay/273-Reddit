const Community = require("../../../models/mongo/Community");

const editCommunity = async (msg, callback) => {
  let topicList = [];
  msg.selectedTopic.map(topic => {
    topicList.push({
      topic: topic.topic
    });
  });
  const filter = { _id: msg.ID };
  const updateDoc = {
    $set: {
      communityName: msg.communityName,
      communityDescription: msg.communityDescription,
      topicSelected: topicList,
      imageURL: msg.communityImages,
      rules: msg.listOfRules
    }
  };
  Community.updateOne(filter, updateDoc, (error, result) => {
    if (error) {
      callback(error, null);
      //res.status(500).send("Community is already registered");
    } else {
      callback(null, result);
      //res.status(200).send(result);
    }
  });
};

exports.editCommunity = editCommunity;
