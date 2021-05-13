const Community = require('../../models/mongo/Community')

const vote = async (msg, callback) => {
    const { community_id, voting, user_id } = msg;
    const community = await Community.findById(community_id);
    const v = voting === 1 ? "upvotedBy" : "downvotedBy";
    const m = voting === -1 ? "upvotedBy" : "downvotedBy";

    const found = community[v].filter(v => v.userID?.toString() === user_id);
    if (found.length > 0) {
        found.map(f => {
            community[v].id(f._id).remove();
        });
    } else {
        const found = community[m].filter(v => v.userID?.toString() === user_id);
        if (found.length > 0) {
            found.map(f => {
                community[m].id(f._id).remove();
            });
        }
        community[v].push({ userID: user_id });
    }
    await community.save();

    callback(null, { community });
};

exports.vote = vote;
