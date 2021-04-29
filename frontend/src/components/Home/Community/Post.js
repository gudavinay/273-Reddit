import React, { Component } from "react";
import Comment from "./Comment";
import { Row, Col, Card } from "react-bootstrap";
import "./post.css";
class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div>
            <Card style={{ margin: "0px" }}>
              <Card.Body>
                <Row>
                  <Col xs={1}>
                    <div>
                      <i
                        style={{ cursor: "pointer" }}
                        className="icon icon-arrow-up"
                      ></i>
                      <span>698</span>
                      <i className="icon icon-arrow-down"></i>
                    </div>
                  </Col>
                  <Col>
                    <Row className="postHeader">
                      posted by u/noiragent 21 hours ago
                    </Row>
                    <Row style={{ paddingLeft: "0px" }}>
                      <h3 className="postBodyContent">
                        [Floyd Mayweather] JUNE 6, 2021!!!! #MIAMI Me and Logan
                        Paul will be fighting at the Hardrock Stadium.
                        @mayweatherpromotions @fanmio and @showtimeboxing have
                        come together to bring an epic Event!!!
                      </h3>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>

              <Card.Footer>
                <div className="postFooter">
                  <div className="postFooterDiv">
                    <i className="icon icon-comment"></i>
                    <span className="postFooterSpan">1.1k comments</span>
                  </div>
                  <div className="postFooterDiv">
                    <i className="icon icon-gift"></i>
                    <span className="postFooterSpan">Award</span>
                  </div>
                  <div className="postFooterDiv">
                    <i className="icon icon-share-alt"></i>
                    <span className="postFooterSpan">Share</span>
                  </div>
                  <div className="postFooterDiv">
                    <i className="icon icon-bookmark"></i>
                    <span className="postFooterSpan">Save</span>
                  </div>
                  <div className="postFooterDiv">
                    <i className="icon icon-ban-circle"></i>
                    <span className="postFooterSpan">Hide</span>
                  </div>
                  <div className="postFooterDiv">
                    <i className="icon icon-flag"></i>
                    <span className="postFooterSpan">Report</span>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </div>
        </div>

        <Comment content="new comment" />
      </React.Fragment>
    );
  }
}

export default Post;
