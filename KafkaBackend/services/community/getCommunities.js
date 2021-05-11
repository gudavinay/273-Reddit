const Community = require("../../models/mongo/Community");

const getCommunities = async (msg, callback) => {
    let res = {};
    current_user = msg.u_id;
    console.log(current_user);
    Community.find(
        {
            listOfUsers: {
                $elemMatch: { userID: current_user, isAccepted: true },
            },
        },
        (err, result) => {
            if (err) {
                // console.log(err);
                res.status = 500;
                callback(null, res);
            } else {
                // console.log("result");
                let myCommunities = [];
                for (let i = 0; i < result.length; i++) {
                    let community = {
                        community_id: result[i]._id,
                        community_name: result[i].communityName,
                    };
                    myCommunities.push(community);
                }
                // console.log(myCommunities);
                res.data = myCommunities;
                res.status = 200;
                callback(null, res);
            }
        }
    );
};

exports.getCommunities = getCommunities;
