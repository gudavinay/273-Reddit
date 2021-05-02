import React, { Component } from "react";
// import Comment from './Comment';
import Post from "./Post";
import backendServer from "../../../webConfig";
import Axios from "axios";
import { getRelativeTime } from "../../../services/ControllerUtils";
import "../../styles/voteButtonStyles.css";

class DetailedPostView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("this.props detailed post view = ", this.props.data);
    this.props.setLoader();
    Axios.post(backendServer + "/getCommentsWithPostID", {
      postID: this.props.data._id,
    })
      .then((response) => {
        this.props.unsetLoader();
        // this.setState({ comments: response.data });

        var parentCommentList = response.data.filter(
          (comment) => comment.isParentComment
        );
        console.log("BEFORE", parentCommentList);

        parentCommentList.forEach((parentComment) => {
          var child = response.data.filter(
            (comment) => comment.parentCommentID == parentComment._id
          );
          console.log("CHILDREN", child);
          console.log("PARENT BEFORE ADDING", parentComment);
          parentComment.child = child;
          console.log("PARENT AFTER ADDING", parentComment);
        });
        console.log("AFTER", parentCommentList);
        this.setState({ parentCommentList: parentCommentList });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  render() {
    var commentsToRender = [];
    if (this.state.parentCommentList) {
      this.state.parentCommentList.forEach((comment) => {
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
                  <strong> 698 </strong>
                </span>
                <i className="icon icon-arrow-down downvote" />
                <i className="fa fa-reply" style={{ marginLeft: "20px" }} />
                <span className="postFooterSpan">Reply</span>
              </div>
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
                <div>{childComment.description}</div>
                <div>
                  <i
                    style={{ cursor: "pointer" }}
                    className="icon icon-arrow-up upvote"
                  />
                  <span style={{ margin: "0 5px" }}>
                    <strong> 698 </strong>
                  </span>
                  <i className="icon icon-arrow-down downvote" />
                </div>
              </div>
            </div>
          );
        });
      });
    }
    return (
      <React.Fragment>
        <Post data={this.props.data} detailedView={true} />
        <div style={{ padding: "0 20px", marginTop: "20px" }}>
          <div style={{ boxShadow: "0px 0px 1px #777", padding: "1px" }}>
            <textarea
              style={{ border: "none" }}
              type="text"
              className="form-control commentTextArea"
              name="primaryComment"
              id="primaryComment"
              placeholder="What are your thoughts?"
              onChange={(e) =>
                this.setState({ primaryComment: e.target.value })
              }
            />
            <button
              className="form-control"
              style={{
                backgroundColor: "#0266b3",
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
