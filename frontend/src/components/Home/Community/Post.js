import React, { Component } from "react";
import { Row, Col, Card, Modal, ModalBody } from "react-bootstrap";
import "./post.css";
import { getRelativeTime } from "../../../services/ControllerUtils";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import DetailedPostView from "./DetailedPostView";
class Post extends Component {
  constructor(props) {
    super(props);
    console.log("PROPS IN POST COMPONENT", this.props.detailedView, props);
    this.state = {
      showPostModal: false,
    };
    this.postClicked = this.postClicked.bind(this);
  }

  // componentDidMount() {
  //   console.log("this.props post.js  = ", this.props);
  //   this.props.setLoader();
  // }
  postClicked = () => {
    console.log(this.props.data._id);
    this.setState({ selectedPostID: this.props.data._id, showPostModal: true });
  };
  render() {
    let _modalWindow,
      postSpecificContent = null;
    if (this.state.showPostModal) {
      _modalWindow = (
        <Modal
          show={this.state.showPostModal}
          onHide={() => this.setState({ showPostModal: false })}
          size="lg"

        >
          <ModalHeader style={{ backgroundColor: this.props.darkMode ? "#1B1B1B" : 'white' }} closeButton></ModalHeader>
          <ModalBody style={{ backgroundColor: this.props.darkMode ? "#1B1B1B" : 'white' }}>
            <DetailedPostView {...this.props} />
          </ModalBody>
        </Modal>
      );
    }
    postSpecificContent = (
      <div style={{ cursor: this.props.detailedView ? "default" : "pointer" }}
        onClick={() => {
          if (!this.props.detailedView) {
            this.postClicked();
          }
        }}>
        <Row className="postHeader">
          posted by {this.props.data?.createBy}{" "}
          {getRelativeTime(this.props.data?.createdAt)}
        </Row>
        <Row style={{ paddingLeft: "0px" }}>
          <h3 className="postBodyContent">[{this.props.data?.title}]</h3>
          {this.props.data?.description}
        </Row>
      </div>
    );

    return (
      <React.Fragment>
        {/* {JSON.stringify(this.props.data)} */}
        <Card style={{ margin: "0px", backgroundColor: this.props.darkMode ? '#1B1B1B' : 'white' }}>
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
              <Col>{postSpecificContent}</Col>
            </Row>
          </Card.Body>

          <Card.Footer>
            <div className="postFooter">
              <div style={{ cursor: this.props.detailedView ? "default" : "pointer" }}
                onClick={() => {
                  if (!this.props.detailedView) {
                    this.postClicked();
                  }
                }}
                className="postFooterDiv"
              >
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
        {_modalWindow}
      </React.Fragment>
    );
  }
}

export default Post;
