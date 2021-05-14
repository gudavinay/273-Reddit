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
import { TablePagination } from "@material-ui/core";
import {
  getDefaultRedditProfilePicture,
  getMongoUserID,
  getToken,
} from "../../../services/ControllerUtils";
import errorSVG from "../../../assets/404.svg";
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
      page: 0,
      size: 2,
      count: 0,
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
    };
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.setComments = this.setComments.bind(this);
  }

  PageSizeChange = (e) => {
    this.setState({
      size: Number(e.target.value),
      page: 0,
    });
    this.getPostOfCommunity(0, Number(e.target.value));
  };

  PageChange = (e, page) => {
    this.setState({
      page: Number(page),
    });
    this.getPostOfCommunity(Number(page), this.state.size);
  };
  componentDidUpdate(prevState) {
    if (
      JSON.stringify(prevState.communityDetails) !=
        JSON.stringify(this.state.communityDetails) &&
      this.state.communityDetails &&
      this.state.communityDetails.listOfUsers &&
      this.state.communityDetails.listOfUsers.length > 0
    ) {
      this.state.communityDetails.listOfUsers.forEach((user) => {
        if (!user.userID.profile_picture_url) {
          user.userID.profile_picture_url = getDefaultRedditProfilePicture();
        }
      });
    }
  }

  componentDidMount = async () => {
    this.props.setLoader();
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(
        `${backendServer}/getCommunityDetails?ID=${
          this.state.community_id
        }&requirePopulate=${true}`
      )
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ communityDetails: response.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
    this.getPostOfCommunity(this.state.page, this.state.size);
  };

  getPostOfCommunity(page, size) {
    this.props.setLoader();
    axios.defaults.headers.common["authorization"] = getToken();
    console.log(
      `${backendServer}/getPostsInCommunity?ID=${
        this.state.community_id
      }&userId=${getMongoUserID()}&page=${page}&size=${size}`
    );
    axios
      .get(
        `${backendServer}/getPostsInCommunity?ID=${
          this.state.community_id
        }&userId=${getMongoUserID()}&page=${page}&size=${size}`
      )
      .then((response) => {
        this.props.unsetLoader();
        console.log("posts = ", response.data);
        this.setState(
          { posts: response.data.post, count: response.data.total },
          () => {}
        );
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  upVote(postId, userVoteDir, index) {
    var relScore = userVoteDir == 1 ? -1 : userVoteDir == 0 ? 1 : 2;
    console.log("upvote req  = ", postId, " ", userVoteDir, " ", index);
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .post(backendServer + "/addVote", {
        entityId: postId,
        userId: getMongoUserID(),
        voteDir: userVoteDir == 1 ? 0 : 1,
        relScore: relScore,
        entityName: "Post",
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
    // const oldScore = 0;
    var relScore = userVoteDir == -1 ? 1 : userVoteDir == 0 ? -1 : -2;
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .post(backendServer + "/addVote", {
        entityId: postId,
        userId: getMongoUserID(),
        voteDir: userVoteDir == -1 ? 0 : -1,
        relScore: relScore,
        entityName: "Post",
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
    var postsToRender = [],
      usersPresentInTheCommunity = [];
    var isUserBeingInvitedByModerator = false,
      didUserRequestToJoin = false;
    var participationButton = null;
    var userStatusInCommunityForJoinReq = null;
    var userStatusInCommunityForSentInvite = null;
    var showPosts = true;
    if (this.state.communityDetails) {
      if (
        this.state.communityDetails.ownerID &&
        this.state.communityDetails.ownerID._id == getMongoUserID()
      ) {
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
        if (
          this.state.communityDetails.listOfUsers &&
          this.state.communityDetails.listOfUsers.length > 0
        ) {
          userStatusInCommunityForJoinReq =
            this.state.communityDetails.listOfUsers.find(
              (user) => user.userID._id == getMongoUserID()
            );
          if (userStatusInCommunityForJoinReq) {
            didUserRequestToJoin = true;
          }
        }
        if (
          this.state.communityDetails.sentInvitesTo &&
          this.state.communityDetails.sentInvitesTo.length > 0
        ) {
          userStatusInCommunityForSentInvite =
            this.state.communityDetails.sentInvitesTo.find(
              (user) => user.userID._id == getMongoUserID()
            );
          if (userStatusInCommunityForSentInvite) {
            isUserBeingInvitedByModerator = true;
          }
        }
        if (didUserRequestToJoin || isUserBeingInvitedByModerator) {
          if (didUserRequestToJoin) {
            if (userStatusInCommunityForJoinReq.isAccepted == 1) {
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
                    axios.defaults.headers.common["authorization"] = getToken();
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
            } else if (userStatusInCommunityForJoinReq.isAccepted == -1) {
              showPosts = false;
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
              showPosts = false;
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
                  Waiting for approval.
                </button>
              );
            }
          } else if (isUserBeingInvitedByModerator) {
            showPosts = false;
            participationButton = (
              <Row>
                <Col>
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
                </Col>
                <Col>
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
                </Col>
              </Row>
            );
          }
        } else {
          showPosts = false;
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
                axios.defaults.headers.common["authorization"] = getToken();
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
      if (
        this.state.communityDetails.listOfUsers &&
        this.state.communityDetails.listOfUsers.length > 0
      ) {
        usersPresentInTheCommunity =
          this.state.communityDetails.listOfUsers.filter(
            (user) => user.isAccepted == 1
          );
      }
    }
    if (showPosts) {
      if (this.state.posts) {
        this.state.posts.forEach((post, index) => {
          postsToRender.push(
            <Post
              key={index}
              upVote={this.upVote}
              downVote={this.downVote}
              index={index}
              setCommentsCount={this.setComments}
              data={post}
              {...this.props}
            ></Post>
          );
        });
        postsToRender.push(
          <div>
            {" "}
            <TablePagination
              count={this.state.count}
              page={this.state.page}
              onChangePage={this.PageChange}
              rowsPerPage={this.state.size}
              onChangeRowsPerPage={this.PageSizeChange}
              color="primary"
              rowsPerPageOptions={[2, 5, 10]}
            />
          </div>
        );
      }
    } else {
      postsToRender.push(
        <div style={{ textAlign: "center", padding: "8%" }}>
          <img alt="" width="25%" src={errorSVG} />
          <h3>
            r/<strong>{this.state.communityDetails?.communityName}</strong> is a
            private community
          </h3>
          You need to be a part of this community to see the posts.
          <Link to="/home">
            <h4>Home</h4>
          </Link>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div
          style={{
            display: "block",
            height: "5%",
            color: "white",
          }}
          className="gradientShade"
        >
          .
        </div>
        <Row className="communityHeaderInfo" style={{ margin: "0" }}>
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
          <Col sm={3}>{participationButton}</Col>
        </Row>
        <div className="container">
          <Row>
            <div>
              <Row>
                <Col xs={8}>
                  {showPosts && (
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
                      <Link
                        to={{
                          pathname: `/createPost/${this.state.community_id}`,
                          rules: this.state.communityDetails?.rules,
                          communityName:
                            this.state.communityDetails?.communityName,
                        }}
                      >
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
                  )}
                  {postsToRender}
                </Col>
                <Col>
                  {this.state.communityDetails &&
                    this.state.communityDetails.imageURL &&
                    this.state.communityDetails.imageURL.length > 0 && (
                      <Row>
                        <Card className="card">
                          <Card.Header className="cardHeader">
                            r/{this.state.communityDetails.communityName}&apos;s
                            images
                          </Card.Header>
                          <Card.Body>
                            <Carousel interval={1500}>
                              {this.state.communityDetails.imageURL.map(
                                (image) => {
                                  return (
                                    <Carousel.Item key={image._id}>
                                      <div
                                        style={{
                                          textAlign: "center",
                                          boxShadow:
                                            "10px ​5px 5px -4px white inset",
                                        }}
                                      >
                                        <img
                                          src={image.url}
                                          alt=""
                                          style={{
                                            height: "220px",
                                            width: "320px",
                                          }}
                                        ></img>
                                      </div>
                                    </Carousel.Item>
                                  );
                                }
                              )}
                            </Carousel>
                          </Card.Body>
                        </Card>
                      </Row>
                    )}

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
                                    <div key={index}>
                                      <strong>{rule.title}</strong>:{" "}
                                      {rule.description}
                                    </div>
                                  );
                                } else {
                                  if (index == 5) {
                                    normalView.push(
                                      <div
                                        key={index}
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
                                  <div key={index}>
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
                                                  showMoreRules:
                                                    !state.showMoreRules,
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
                                        key={topic._id}
                                        className="upArrowRotate"
                                        style={{
                                          display: !this.state.showMoreTopics
                                            ? "block"
                                            : "none",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          this.setState((state) => ({
                                            showMoreTopics:
                                              !state.showMoreTopics,
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
                                                  showMoreTopics:
                                                    !state.showMoreTopics,
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

                  {this.state.communityDetails && showPosts && (
                    <Row>
                      <Card className="card">
                        <Card.Header className="cardHeader">
                          r/{this.state.communityDetails.communityName}&apos;s
                          Stats
                        </Card.Header>
                        <Card.Body>
                          <div>
                            <strong>Total Posts:</strong>{" "}
                            {this.state.posts?.length
                              ? this.state.posts?.length
                              : "0"}
                          </div>
                          <div>
                            <strong>Total Users:</strong>{" "}
                            {usersPresentInTheCommunity.length + 1}
                          </div>

                          <div>
                            <div>
                              <strong>List of Users:</strong>
                            </div>
                            <Row
                              style={{ padding: "0 10px", marginTop: "10px" }}
                            >
                              <Col sm={2} style={{ margin: "4px 0px" }}>
                                <img
                                  src={
                                    this.state.communityDetails.ownerID
                                      .profile_picture_url
                                      ? this.state.communityDetails.ownerID
                                          .profile_picture_url
                                      : this.state
                                          .getDefaultRedditProfilePicture
                                  }
                                  style={{
                                    height: "30px",
                                    width: "30px",
                                    borderRadius: "15px",
                                  }}
                                />
                                {/* {user.userID.profile_picture_url ? <img src={user.userID.profile_picture_url} style={{ height: '30px', width: '30px', borderRadius: '15px' }} /> : <img src={getDefaultRedditProfilePicture()} style={{ height: '30px', width: '30px', borderRadius: '15px' }} />} */}
                              </Col>
                              <Col style={{ paddingLeft: "0" }}>
                                <Link
                                  style={{ color: "black" }}
                                  to={`/user/${this.state.communityDetails.ownerID?.userIDSQL}`}
                                >
                                  u/
                                  <strong>
                                    {this.state.communityDetails.ownerID.name}
                                  </strong>
                                </Link>
                              </Col>
                            </Row>
                            {usersPresentInTheCommunity.length > 0 && (
                              <div style={{ padding: "0 10px" }}>
                                {usersPresentInTheCommunity.map(
                                  (user, index) => {
                                    var normalView = [],
                                      expandedView = [];

                                    if (index < 5) {
                                      normalView.push(
                                        <div key={user.userID._id}>
                                          <Row>
                                            <Col
                                              sm={2}
                                              style={{ margin: "4px 0px" }}
                                            >
                                              <img
                                                src={
                                                  user.userID
                                                    .profile_picture_url
                                                }
                                                style={{
                                                  height: "30px",
                                                  width: "30px",
                                                  borderRadius: "15px",
                                                }}
                                              />
                                              {/* {user.userID.profile_picture_url ? <img src={user.userID.profile_picture_url} style={{ height: '30px', width: '30px', borderRadius: '15px' }} /> : <img src={getDefaultRedditProfilePicture()} style={{ height: '30px', width: '30px', borderRadius: '15px' }} />} */}
                                            </Col>
                                            <Col style={{ paddingLeft: "0" }}>
                                              u/
                                              <strong>
                                                {user.userID.name}
                                              </strong>
                                            </Col>
                                          </Row>
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
                                                showMoreUsers:
                                                  !state.showMoreUsers,
                                              }))
                                            }
                                          >
                                            <i className="fa fa-angle-double-down" />
                                          </div>
                                        );
                                      }
                                      expandedView.push(
                                        <Row>
                                          <Col
                                            sm={2}
                                            style={{ margin: "2px 0px" }}
                                          >
                                            <img
                                              src={
                                                user.userID.profile_picture_url
                                              }
                                              style={{
                                                height: "30px",
                                                width: "30px",
                                                borderRadius: "15px",
                                              }}
                                            />
                                            {/* {user.userID.profile_picture_url ? <img src={user.userID.profile_picture_url} style={{ height: '30px', width: '30px', borderRadius: '15px' }} /> : <img src={getDefaultRedditProfilePicture()} style={{ height: '30px', width: '30px', borderRadius: '15px' }} />} */}
                                          </Col>
                                          <Col style={{ paddingLeft: "0" }}>
                                            <Link
                                              style={{ color: "black" }}
                                              to={`/user/${user.userID.userIDSQL}`}
                                            >
                                              u/
                                              <strong>
                                                {user.userID.name}
                                              </strong>
                                            </Link>
                                          </Col>
                                        </Row>
                                      );
                                    }
                                    expandedView.push(
                                      <Row>
                                        <Col
                                          sm={2}
                                          style={{ margin: "2px 0px" }}
                                        >
                                          <img
                                            src={
                                              user.userID.profile_picture_url
                                            }
                                            style={{
                                              height: "30px",
                                              width: "30px",
                                              borderRadius: "15px",
                                            }}
                                          />
                                          {/* {user.userID.profile_picture_url ? <img src={user.userID.profile_picture_url} style={{ height: '30px', width: '30px', borderRadius: '15px' }} /> : <img src={getDefaultRedditProfilePicture()} style={{ height: '30px', width: '30px', borderRadius: '15px' }} />} */}
                                        </Col>
                                        <Col style={{ paddingLeft: "0" }}>
                                          <Link
                                            style={{ color: "black" }}
                                            to={`/user/${user.userID.userIDSQL}`}
                                          >
                                            u/
                                            <strong>{user.userID.name}</strong>
                                          </Link>
                                        </Col>
                                      </Row>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Row>
                  )}
                </Col>
              </Row>
            </div>
          </Row>
          {/* <div
            style={{
              textAlign: "right",
              position: "fixed",
              left: "0",
              bottom: "0",
              height: "60px",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "block",
                padding: "20px",
                height: "60px",
                width: "100%"
              }}
            >
              <span>Top ^ Yet to be impl</span>
            </div>
          </div> */}
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
