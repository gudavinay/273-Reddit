const Community = require("../../../models/mongo/Community");

const createCommunity = async (msg, callback) => {
  let topicList = [];
  msg.selectedTopic.map(topic => {
    topicList.push({
      topic: topic.topic
    });
  });
  let community = new Community({
    communityName: msg.communityName,
    communityDescription: msg.communityDescription,
    ownerID: msg.ownerID,
    NoOfPost: 0,
    topicSelected: topicList,
    imageURL: msg.communityImages,
    rules: msg.listOfRules
  });
  community.save((error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data);
      //   console.log(JSON.stringify(data));
      //   res.status(200).send(JSON.stringify(data));
    }
  });
};

exports.createCommunity = createCommunity;
