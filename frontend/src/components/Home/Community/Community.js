import React, { Component } from "react";
import Post from "./Post";
import "./community.css";
import gallerySvg from "../../../assets/communityIcons/galleryIcon.svg";
import linkSvg from "../../../assets/communityIcons/linkIcon.svg";
import userSvg from "../../../assets/communityIcons/redditUserLogoIcon.svg";
import { Row, Col, Card, Collapse, Fade, Carousel } from "react-bootstrap";
// import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import axios from "axios";
import backendServer from "../../../webConfig";
import {
  getDefaultRedditProfilePicture,
  getMongoUserID,
} from "../../../services/ControllerUtils";
// import { withStyles } from "@material-ui/core/styles";
// import { useTheme } from "@material-ui/core/styles";

// import { useTheme } from '@react-navigation/native';
// eslint-disable-next-line no-unused-vars
// const styles = theme => ({
//   rowBackround: {
//     backgroundColor: theme.palette.background,
//   }
// });
class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      community_id: props.location.pathname
        ? this.props.location.pathname.replace("/community/", "")
        : "",
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
    };
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.setComments = this.setComments.bind(this);
  }

  componentDidMount = async () => {
    this.props.setLoader();
    axios
      .get(`${backendServer}/getCommunityDetails?ID=${this.state.community_id}`)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ communityDetails: response.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });

    this.props.setLoader();
    axios
      .get(
        `${backendServer}/getPostsInCommunity?ID=${this.state.community_id
        }&userId=${getMongoUserID()}`
      )
      .then((response) => {
        this.props.unsetLoader();
        console.log("posts = ", response.data);
        this.setState({ posts: response.data }, () => { });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };

  upVote(postId, userVoteDir, index) {
    console.log("upvote req  = ", postId, " ", userVoteDir, " ", index);
    axios
      .post(backendServer + "/addVote", {
        entityId: postId,
        userId: getMongoUserID(),
        voteDir: userVoteDir == 1 ? 0 : 1,
      })
      .then((response) => {
        // this.props.unsetLoader();
        console.log("upVOted successfull = ", response);
        console.log("this.state = ", this.state);
        console.log("this.state = ", this.state.posts[index].userVoteDir);
        const newPosts = this.state.posts.slice();
        newPosts[index].score =
          userVoteDir == 1
            ? newPosts[index].score - 1
            : userVoteDir == 0
              ? newPosts[index].score + 1
              : newPosts[index].score + 2;

        newPosts[index].userVoteDir = userVoteDir == 1 ? 0 : 1;
        console.log("newComments = ", newPosts);
        this.setState({ parentCommentList: newPosts });
        // this.fetchCommentsWithPostID();
      })
      .catch((err) => {
        // this.props.unsetLoader();
        console.log(err);
      });
  }

  downVote(postId, userVoteDir, index) {
    axios
      .post(backendServer + "/addVote", {
        entityId: postId,
        userId: getMongoUserID(),
        voteDir: userVoteDir == -1 ? 0 : -1,
      })
      .then((response) => {
        // this.props.unsetLoader();
        console.log("downvoted successfull = ", response);
        const newPosts = this.state.posts.slice();
        newPosts[index].score =
          userVoteDir == -1
            ? newPosts[index].score + 1
            : userVoteDir == 0
              ? newPosts[index].score - 1
              : newPosts[index].score - 2;

        // newComments[index].userVoteDir = response.data.userVoteDir;
        newPosts[index].userVoteDir = userVoteDir == -1 ? 0 : -1;
        console.log("newComments = ", newPosts);
        this.setState({ parentCommentList: newPosts });
        // this.fetchCommentsWithPostID();
      })
      .catch((err) => {
        // this.props.unsetLoader();
        console.log(err);
      });
  }
  setComments = (commentsCount, index) => {
    console.log("set comments in community = ", commentsCount, index);
    const newPosts = this.state.posts.slice();
    newPosts[index].commentsCount = commentsCount;
    this.setState({ parentCommentList: newPosts });
    // this.setState({ commentsCount: commentsCount });
  };

  render() {
    var postsToRender = [], usersPresentInTheCommunity = [];
    if (this.state.posts) {
      this.state.posts.forEach((post, index) => {
        postsToRender.push(
          <Post
            upVote={this.upVote}
            downVote={this.downVote}
            index={index}
            setCommentsCount={this.setComments}
            data={post}
            {...this.props}
          ></Post>
        );
      });
    }
    var participationButton = null;
    var userStatusInCommunity = null;
    if (this.state.communityDetails) {
      if (this.state.communityDetails.ownerID == getMongoUserID()) {
        participationButton = (
          <button
            className="form-control"
            disabled
            style={{
              display: "block",
              borderRadius: "30px",
              background: "#e17157",
              color: "white",
              cursor: "not-allowed",
            }}
          >
            Moderator
          </button>
        );
      } else {
        var isUserBeingInvitedByModerator = false,
          didUserRequestToJoin = false;
        if (
          this.state.communityDetails.listOfUsers &&
          this.state.communityDetails.listOfUsers.length > 0
        ) {
          userStatusInCommunity = this.state.communityDetails.listOfUsers.find(
            (user) => user.userID == getMongoUserID()
          );
          if (userStatusInCommunity) {
            didUserRequestToJoin = true;
          }
        }
        if (
          this.state.communityDetails.sentInvitesTo &&
          this.state.communityDetails.sentInvitesTo.length > 0
        ) {
          userStatusInCommunity = this.state.communityDetails.listOfUsers.find(
            (user) => user.userID == getMongoUserID()
          );
          if (userStatusInCommunity) {
            isUserBeingInvitedByModerator = true;
          }
        }
        if (didUserRequestToJoin || isUserBeingInvitedByModerator) {
          if (didUserRequestToJoin) {
            if (userStatusInCommunity.isAccepted == 1) {
              participationButton = (
                <button
                  className="form-control"
                  style={{
                    display: "block",
                    borderRadius: "30px",
                    background: "#e17157",
                    color: "white",
                  }}
                  onClick={() => {
                    this.props.setLoader();
                    axios
                      .post(`${backendServer}/userLeaveRequestFromCommunity`, {
                        community_id: this.state.community_id,
                        user_id: getMongoUserID(),
                      })
                      .then((response) => {
                        this.props.unsetLoader();
                        console.log(response);
                        this.setState({ communityDetails: response.data });
                      })
                      .catch((err) => {
                        this.props.unsetLoader();
                        console.log(err);
                      });
                  }}
                >
                  Leave
                </button>
              );
            } else if (userStatusInCommunity.isAccepted == -1) {
              participationButton = (
                <button
                  disabled
                  className="form-control"
                  style={{
                    display: "block",
                    borderRadius: "30px",
                    background: "#e17157",
                    color: "white",
                  }}
                >
                  Request to join denied.
                </button>
              );
            } else {
              participationButton = (
                <button
                  disabled
                  className="form-control"
                  style={{
                    display: "block",
                    borderRadius: "30px",
                    background: "#e17157",
                    color: "white",
                  }}
                >
                  Request Pending
                </button>
              );
            }
          } else if (isUserBeingInvitedByModerator) {
            participationButton = (
              <div>
                <button
                  className="form-control"
                  style={{
                    display: "block",
                    borderRadius: "30px",
                    background: "#e17157",
                    color: "white",
                  }}
                  onClick={() => {
                    alert("Yet to be implemented");
                  }}
                >
                  Accept
                </button>
                <button
                  className="form-control"
                  style={{
                    display: "block",
                    borderRadius: "30px",
                    background: "#e17157",
                    color: "white",
                  }}
                  onClick={() => {
                    alert("Yet to be implemented");
                  }}
                >
                  Reject
                </button>
              </div>
            );
          }
        } else {
          participationButton = (
            <button
              className="form-control"
              style={{
                display: "block",
                borderRadius: "30px",
                background: "#e17157",
                color: "white",
              }}
              onClick={() => {
                this.props.setLoader();
                axios
                  .post(`${backendServer}/userJoinRequestToCommunity`, {
                    community_id: this.state.community_id,
                    user_id: getMongoUserID(),
                  })
                  .then((response) => {
                    this.props.unsetLoader();
                    console.log(response);
                    this.setState({ communityDetails: response.data });
                  })
                  .catch((err) => {
                    this.props.unsetLoader();
                    console.log(err);
                  });
              }}
            >
              Join
            </button>
          );
        }
      }
      if (this.state.communityDetails.listOfUsers && this.state.communityDetails.listOfUsers.length > 0) {
        usersPresentInTheCommunity = this.state.communityDetails.listOfUsers.filter(user => user.isAccepted == 1);
      }
    }



    return (
      <React.Fragment>
        <div
          style={{
            display: "block",
            height: "5%",
            backgroundColor: "pink",
            color: "white",
          }}
        >
          .
        </div>
        <Row className="communityHeaderInfo">
          <Col sm={1}>
            <img
              width="40px"
              style={{ borderRadius: "20px", margin: "5px" }}
              src={this.state.getDefaultRedditProfilePicture}
              alt=""
            />
          </Col>
          <Col sm={7}>
            <div style={{ fontWeight: "bold", fontSize: "15px" }}>
              {this.state.communityDetails?.communityName}
            </div>
            <div style={{ fontSize: "13px" }}>
              {this.state.communityDetails?.communityDescription}
            </div>
          </Col>
          <Col sm={2}>{participationButton}</Col>
        </Row>
        <div className="container">
          <Row>
            <div>
              <Row>
                <Col xs={8}>
                  <div className="createPostH">
                    <a>
                      <img
                        style={{
                          height: "30px",
                          width: "30px",
                          border: "1px solid",
                          borderRadius: "27px",
                          padding: "2px",
                          margin: "3px",
                        }}
                        alt="User Logo"
                        src={userSvg}
                      />
                    </a>{" "}
                    <Link to={`/createPost/${this.state.community_id}`}>
                      <input
                        className="createPostInput"
                        placeholder="Create Post"
                        type="text"
                      />
                    </Link>
                    <a className="galleryAnchor">
                      <img
                        style={{ height: "30px", width: "22px" }}
                        alt="Gallery Logo"
                        src={gallerySvg}
                      />
                    </a>
                    <a className="galleryAnchor">
                      <img
                        style={{ height: "30px", width: "22px" }}
                        alt="Link Logo"
                        src={linkSvg}
                      />
                    </a>
                  </div>
                  {postsToRender}
                </Col>
                <Col>
                  {this.state.communityDetails && this.state.communityDetails.imageURL &&
                    this.state.communityDetails.imageURL.length > 0 && (<Row>
                      <Card className="card">
                        <Card.Header className="cardHeader">
                          r/{this.state.communityDetails.communityName}&apos;s
                          images
                        </Card.Header>
                        <Card.Body>
                          <Carousel interval={1500}>
                            {this.state.communityDetails.imageURL.map(
                              (image) => {
                                return (<Carousel.Item
                                  key={image._id}>
                                  <div style={{ textAlign: 'center', boxShadow: '10px ​5px 5px -4px white inset' }}>
                                    <img
                                      src={image.url}
                                      alt=""
                                      style={{ height: "220px", width: "320px" }}
                                    ></img>
                                  </div>
                                </Carousel.Item>);
                              }
                            )}
                          </Carousel>
                        </Card.Body>
                      </Card>
                    </Row>)}

                  {this.state.communityDetails &&
                    this.state.communityDetails.rules &&
                    this.state.communityDetails.rules.length > 0 && (
                      <Row>
                        <Card className="card">
                          <Card.Header className="cardHeader">
                            r/{this.state.communityDetails.communityName}&apos;s
                            Rules
                          </Card.Header>
                          <Card.Body>
                            {this.state.communityDetails.rules.map(
                              (rule, index) => {
                                var normalView = [],
                                  expandedView = [];

                                if (index < 5) {
                                  normalView.push(
                                    <div key={rule._id}>
                                      <strong>{rule.title}</strong>:{" "}
                                      {rule.description}
                                    </div>
                                  );
                                } else {
                                  if (index == 5) {
                                    normalView.push(
                                      <div
                                        className="upArrowRotate"
                                        style={{
                                          display: !this.state.showMoreRules
                                            ? "block"
                                            : "none",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.setState((state) => ({
                                            showMoreRules: !state.showMoreRules,
                                          }))
                                        }
                                      >
                                        <i className="fa fa-angle-double-down" />
                                      </div>
                                    );
                                  }
                                  expandedView.push(
                                    <div key={rule._id}>
                                      <strong>{rule.title}</strong>:{" "}
                                      {rule.description}
                                    </div>
                                  );
                                }
                                return (
                                  <div key="">
                                    {normalView}
                                    <Collapse in={this.state.showMoreRules}>
                                      <Fade>
                                        <div>
                                          {expandedView}
                                          {this.state.communityDetails.rules
                                            .length -
                                            1 ==
                                            index ? (
                                            <div
                                              className="downArrowRotate"
                                              style={{
                                                display: this.state
                                                  .showMoreRules
                                                  ? "block"
                                                  : "none",
                                                textAlign: "center",
                                              }}
                                              onClick={() =>
                                                this.setState((state) => ({
                                                  showMoreRules: !state.showMoreRules,
                                                }))
                                              }
                                            >
                                              <i className="fa fa-angle-double-up" />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Fade>
                                    </Collapse>
                                  </div>
                                );
                              }
                            )}
                          </Card.Body>
                        </Card>
                      </Row>
                    )}
                  {this.state.communityDetails &&
                    this.state.communityDetails.topicSelected &&
                    this.state.communityDetails.topicSelected.length > 0 && (
                      <Row>
                        <Card className="card">
                          <Card.Header className="cardHeader">
                            r/{this.state.communityDetails.communityName}
                            &apos;s interested topics
                          </Card.Header>
                          <Card.Body>
                            {this.state.communityDetails.topicSelected.map(
                              (topic, index) => {
                                var normalView = [],
                                  expandedView = [];

                                if (index < 5) {
                                  normalView.push(
                                    <div key={topic._id}>
                                      <strong>{topic.topic}</strong>
                                    </div>
                                  );
                                } else {
                                  if (index == 5) {
                                    normalView.push(
                                      <div
                                        className="upArrowRotate"
                                        style={{
                                          display: !this.state.showMoreTopics
                                            ? "block"
                                            : "none",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.setState((state) => ({
                                            showMoreTopics: !state.showMoreTopics,
                                          }))
                                        }
                                      >
                                        <i className="fa fa-angle-double-down" />
                                      </div>
                                    );
                                  }
                                  expandedView.push(
                                    <div key={topic._id}>
                                      <strong>{topic.topic}</strong>
                                    </div>
                                  );
                                }
                                return (
                                  <div key="">
                                    {normalView}
                                    <Collapse in={this.state.showMoreTopics}>
                                      <Fade>
                                        <div>
                                          {expandedView}
                                          {this.state.communityDetails
                                            .topicSelected.length -
                                            1 ==
                                            index ? (
                                            <div
                                              className="downArrowRotate"
                                              style={{
                                                display: this.state
                                                  .showMoreTopics
                                                  ? "block"
                                                  : "none",
                                                textAlign: "center",
                                              }}
                                              onClick={() =>
                                                this.setState((state) => ({
                                                  showMoreTopics: !state.showMoreTopics,
                                                }))
                                              }
                                            >
                                              <i className="fa fa-angle-double-up" />
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Fade>
                                    </Collapse>
                                  </div>
                                );
                              }
                            )}
                          </Card.Body>
                        </Card>
                      </Row>
                    )}

                  {this.state.communityDetails && (<Row>
                    <Card className="card">
                      <Card.Header className="cardHeader">
                        r/{this.state.communityDetails.communityName}&apos;s
                          Stats
                        </Card.Header>
                      <Card.Body>
                        <div><strong>Total Posts:</strong> {this.state.posts?.length}</div>
                        <div><strong>Total Users:</strong> {usersPresentInTheCommunity.length}</div>
                        <div><strong>List of Users:</strong></div>
                        {usersPresentInTheCommunity.map(
                          (user, index) => {
                            var normalView = [],
                              expandedView = [];

                            if (index < 5) {
                              normalView.push(
                                <div key={user._id}>
                                  {user.userID}
                                </div>
                              );
                            } else {
                              if (index == 5) {
                                normalView.push(
                                  <div
                                    className="upArrowRotate"
                                    style={{
                                      display: !this.state.showMoreUsers
                                        ? "block"
                                        : "none",
                                      textAlign: "center",
                                    }}
                                    onClick={() =>
                                      this.setState((state) => ({
                                        showMoreUsers: !state.showMoreUsers,
                                      }))
                                    }
                                  >
                                    <i className="fa fa-angle-double-down" />
                                  </div>
                                );
                              }
                              expandedView.push(
                                <div key={user._id}>
                                  {user.userID}
                                </div>
                              );
                            }
                            return (
                              <div key="">
                                {normalView}
                                <Collapse in={this.state.showMoreUsers}>
                                  <Fade>
                                    <div>
                                      {expandedView}
                                      {usersPresentInTheCommunity.length -
                                        1 ==
                                        index ? (
                                        <div
                                          className="downArrowRotate"
                                          style={{
                                            display: this.state
                                              .showMoreUsers
                                              ? "block"
                                              : "none",
                                            textAlign: "center",
                                          }}
                                          onClick={() =>
                                            this.setState((state) => ({
                                              showMoreUsers: !state.showMoreUsers,
                                            }))
                                          }
                                        >
                                          <i className="fa fa-angle-double-up" />
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Fade>
                                </Collapse>
                              </div>
                            );
                          }
                        )}
                      </Card.Body>
                    </Card>
                  </Row>)}
                </Col>
              </Row>
            </div>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
// Wrap and export
// eslint-disable-next-line react/display-name
// export default function (props) {
//   const theme = useTheme();

//   return <Community {...props} theme={theme} />;
// }

export default Community;
// export default withStyles(styles, { withTheme: true })(Community);
// export default withStyles(styles)(Community);
