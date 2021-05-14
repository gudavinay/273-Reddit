import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getRelativeTime, nFormatter } from "../../../services/ControllerUtils";
import DefaultCardText from "../../../assets/NoImage.png";

class SearchResult extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data } = this.props;
    const {
      _id: community_id,
      imageURL,
      communityName,
      communityDescription,
      listOfUsersLength,
      //   upVotedLength,
      //   downVotedLength,
      postsLength,
      createdAt,
      ownerID,
    } = data || {};
    return (
      <React.Fragment>
        <Card style={{ margin: "0px" }}>
          <Card.Body style={{ padding: "1px" }}>
            <Row>
              <Col
                xs={1}
                style={{
                  background: "#eef3f7",
                  maxWidth: "4.8%",
                  marginLeft: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <i
                    style={{
                      cursor: "pointer",
                      color: this.props.data.userVoteDir == 1 ? "#ff4500" : "",
                    }}
                    className="icon icon-arrow-up"
                    onClick={() => {
                      if (!this.props.disableVoteButtons)
                        this.props.upVote(
                          this.props.data._id,
                          this.props.data.userVoteDir,
                          this.props.index
                        );
                    }}
                  ></i>

                  <span
                    style={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* {nFormatter(upVotedLength - downVotedLength, 1)} */}
                    {nFormatter(this.props.data.score, 1)}
                  </span>

                  <i
                    style={{
                      cursor: "pointer",
                      color: this.props.data.userVoteDir == -1 ? "#7193ff" : "",
                    }}
                    className="icon icon-arrow-down"
                    onClick={() => {
                      if (!this.props.disableVoteButtons)
                        this.props.downVote(
                          this.props.data._id,
                          this.props.data.userVoteDir,
                          this.props.index
                        );
                    }}
                  ></i>
                </div>
              </Col>
              <Col xs={1} style={{ paddingLeft: "1px" }}>
                {imageURL.length > 0 && imageURL[0].url ? (
                  <img
                    alt="Community"
                    role="presentation"
                    src={imageURL[0].url}
                    style={{
                      backgroundPosition: "50%",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100%",
                      boxSizing: "border-box",
                      flex: "none",
                      fontSize: "32px",
                      lineHeight: "32px",
                      margin: "0 8px",
                      width: "65px",
                      verticalAlign: "middle",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: "#eef3f7",
                      // height: "80%",
                      borderRadius: "5px",
                    }}
                  >
                    <img
                      src={DefaultCardText}
                      style={{ width: "65px", margin: "4px" }}
                    />
                  </div>
                )}
              </Col>
              <Col style={{ paddingLeft: "0px" }}>
                <Row style={{ paddingLeft: "0px" }}>
                  <h3
                    style={{
                      paddingLeft: "5px",
                      fontSize: "16px",
                      paddingTop: "8px",
                      margin: "0px",
                    }}
                  >
                    <Link to={"/community/".concat(community_id)}>
                      {communityName}
                    </Link>
                  </h3>
                  <h4
                    style={{ fontSize: "12px", padding: "8px", width: "95%" }}
                  >
                    {communityDescription.substr(0, 350)}
                  </h4>
                </Row>
                <Row style={{ paddingLeft: "0px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      color: "#878a8c",
                      fill: "#878a8c",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ marginLeft: "0px" }}>
                      <i className="fa fa-users"></i>
                      <span style={{ marginLeft: "4px" }}>
                        {" "}
                        {nFormatter(listOfUsersLength, 1)} Members
                      </span>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <i className="fa fa-sticky-note-o"></i>
                      <span style={{ marginLeft: "4px" }}>
                        {" "}
                        {nFormatter(postsLength, 1)} Posts
                      </span>
                    </div>
                    <div style={{ marginLeft: "10px" }}>
                      <i className="icon icon-user"></i>
                      <span style={{ marginLeft: "4px" }}>
                        {" "}
                        Created By{" "}
                        <Link to={"/user/".concat(ownerID?.userIDSQL)}>
                          {ownerID?.name}
                        </Link>{" "}
                        {getRelativeTime(createdAt)}
                      </span>
                    </div>
                  </div>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default SearchResult;
