import React, { Component } from "react";
// import Comment from './Comment';
import Post from "./Post";
import backendServer from "../../../webConfig";
import Axios from "axios";
import { getRelativeTime } from "../../../services/ControllerUtils";
import "../../styles/voteButtonStyles.css";
import "./DetailedPostView.css";
import { Collapse } from "react-bootstrap";
import { getMongoUserID } from "../../../services/ControllerUtils";

class DetailedPostView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fetchCommentsWithPostID() {
    this.props.setLoader();
    Axios.post(backendServer + "/getCommentsWithPostID", {
      postID: this.props.data._id,
      userId: getMongoUserID(),
    })
      .then((response) => {
        this.props.unsetLoader();
        var parentCommentList = response.data.filter(
          (comment) => comment.isParentComment
        );
        parentCommentList.forEach((parentComment) => {
          var child = response.data.filter(
            (comment) => comment.parentCommentID == parentComment._id
          );
          parentComment.child = child;
        });
        this.setState({ parentCommentList: parentCommentList });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  componentDidMount() {
    this.fetchCommentsWithPostID();
  }

  downVote(commentId, userVoteDir) {
    Axios.post(backendServer + "/addVote", {
      entityId: commentId,
      userId: getMongoUserID(),
      voteDir: userVoteDir == -1 ? 0 : -1,
    })
      .then((response) => {
        // this.props.unsetLoader();
        console.log("downvoted successfull = ", response);
        this.fetchCommentsWithPostID();
      })
      .catch((err) => {
        // this.props.unsetLoader();
        console.log(err);
      });
  }
  render() {
    var commentsToRender = [];
    if (this.state.parentCommentList) {
      this.state.parentCommentList.forEach((comment) => {
        console.log("comment = ", comment);
        commentsToRender.push(
          <div>
            <div style={{ marginTop: "10px" }}>
              <img
                alt=""
                width="40px"
                style={{ borderRadius: "20px", margin: "5px" }}
                src="https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "400",
                  lineHeight: "16px",
                }}
              >
                {comment.userID} {getRelativeTime(comment.createdAt)}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                paddingLeft: "2%",
                borderLeft: "2px solid #edeff1",
                marginLeft: "2.5%",
              }}
            >
              <div>{comment.description}</div>
              <div>
                <i
                  style={{ cursor: "pointer" }}
                  className="icon icon-arrow-up upvote"
                />
                <span style={{ margin: "0 5px" }}>
                  <strong> {comment.score} </strong>
                </span>
                <i
                  style={{ cursor: "pointer" }}
                  className="icon icon-arrow-down downvote"
                  onClick={() =>
                    this.downVote(comment._id, comment.userVoteDir)
                  }
                />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    let key = comment._id;
                    var obj = {};
                    obj[key] = !this.state[key];
                    this.setState(obj);
                  }}
                >
                  <i className="fa fa-reply" style={{ marginLeft: "20px" }} />
                  <span className="postFooterSpan">Reply</span>
                </span>
              </div>
              <Collapse in={this.state[comment._id]}>
                <div
                  style={{
                    boxShadow: "0px 0px 1px #777",
                    padding: "1px",
                    margin: "5px",
                  }}
                >
                  <textarea
                    style={{
                      backgroundColor: this.props.darkMode
                        ? "#1B1B1B"
                        : "white",
                      color: !this.props.darkMode ? "#1B1B1B" : "white",
                    }}
                    type="text"
                    className="commentTextArea"
                    name="subComment"
                    id={comment._id + "id"}
                    placeholder="What are your thoughts?"
                    onChange={(e) => {
                      let key = comment._id + ":"; //to denote the comment text
                      var obj = {};
                      obj[key] = e.target.value;
                      this.setState(obj);
                    }}
                  />
                  <button
                    disabled={!this.state[`${comment._id}:`]}
                    className="form-control"
                    style={{
                      backgroundColor: this.state[`${comment._id}:`]
                        ? "#0266b3"
                        : "#777",
                      borderRadius: "20px",
                      width: "100px",
                      height: "25px",
                      fontSize: "12px",
                      color: "white",
                      fontWeight: "bold",
                      lineHeight: "0px",
                      border: "none",
                      margin: "1% 84%",
                    }}
                    onClick={() => {
                      this.props.setLoader();
                      Axios.post(backendServer + "/comment", {
                        postID: this.props.data._id,
                        description: this.state[`${comment._id}:`],
                        isParentComment: 0,
                        userID: getMongoUserID(),
                        parentCommentID: comment._id,
                      })
                        .then((response) => {
                          this.props.unsetLoader();
                          console.log(response);
                          document.getElementById(comment._id + "id").value =
                            "";
                          let key = comment._id + ":"; //to denote the comment text
                          var obj = {};
                          obj[key] = "";
                          this.setState(obj);
                          this.fetchCommentsWithPostID();
                        })
                        .catch((err) => {
                          this.props.unsetLoader();
                          console.log(err);
                        });
                    }}
                  >
                    Reply
                  </button>
                </div>
              </Collapse>
            </div>
          </div>
        );
        comment.child.forEach((childComment) => {
          commentsToRender.push(
            <div
              style={{
                padding: "1% 4%",
                borderLeft: "2px solid #edeff1",
                marginLeft: "2.5%",
                fontSize: "14px",
              }}
            >
              <div>
                <img
                  alt=""
                  width="30px"
                  style={{ borderRadius: "15px", margin: "2px" }}
                  src="https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/user/12.jpg"
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                  }}
                >
                  {childComment.userID}{" "}
                  {getRelativeTime(childComment.createdAt)}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  paddingLeft: "2%",
                  borderLeft: "2px solid #edeff1",
                  marginLeft: "2.5%",
                }}
              >
                <div>{childComment.description}</div>
                <div>
                  <i
                    style={{ cursor: "pointer" }}
                    className="icon icon-arrow-up upvote"
                  />
                  <span style={{ margin: "0 5px" }}>
                    <strong> {childComment.score} </strong>
                  </span>
                  <i
                    style={{ cursor: "pointer" }}
                    className="icon icon-arrow-down downvote"
                  />
                </div>
              </div>
            </div>
          );
        });
      });
    }
    return (
      <React.Fragment>
        <Post data={this.props.data} {...this.props} detailedView={true} />
        <div
          style={{
            padding: "0 20px",
            marginTop: "20px",
            backgroundColor: this.props.darkMode ? "#1B1B1B" : "white",
          }}
        >
          <div style={{ boxShadow: "0px 0px 1px #777", padding: "1px" }}>
            <textarea
              style={{
                backgroundColor: this.props.darkMode ? "#1B1B1B" : "white",
                color: !this.props.darkMode ? "#1B1B1B" : "white",
              }}
              type="text"
              className="commentTextArea"
              name="primaryComment"
              id="primaryComment"
              placeholder="What are your thoughts?"
              onChange={(e) =>
                this.setState({ primaryComment: e.target.value })
              }
            />
            <button
              disabled={!this.state.primaryComment}
              className="form-control"
              style={{
                backgroundColor: this.state.primaryComment ? "#0266b3" : "#777",
                borderRadius: "20px",
                width: "100px",
                height: "25px",
                fontSize: "12px",
                color: "white",
                fontWeight: "bold",
                lineHeight: "0px",
                border: "none",
                margin: "1% 85%",
              }}
              onClick={() => {
                this.props.setLoader();
                Axios.post(backendServer + "/comment", {
                  postID: this.props.data._id,
                  description: this.state.primaryComment,
                  isParentComment: 1,
                  userID: getMongoUserID(),
                })
                  .then((response) => {
                    this.props.unsetLoader();
                    console.log(response);
                    document.getElementById("primaryComment").value = "";
                    this.setState({ primaryComment: null });
                    this.fetchCommentsWithPostID();
                  })
                  .catch((err) => {
                    this.props.unsetLoader();
                    console.log(err);
                  });
              }}
            >
              Comment
            </button>
          </div>
          {commentsToRender}
        </div>
      </React.Fragment>
    );
  }
}

export default DetailedPostView;
