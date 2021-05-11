import React, { Component } from "react";
import inviteAcceptedSVG from "../../../assets/inviteAccepted.svg";
import inviteRejectedSVG from "../../../assets/inviteRejected.svg";
import { getDefaultRedditProfilePicture, getRelativeTime, getToken } from "../../../services/ControllerUtils";
import { Row, Col, Modal, Button } from "react-bootstrap";
import "./Notification.css";
import Axios from "axios";
import backendServer from "../../../webConfig";
import { getMongoUserID } from "../../../services/ControllerUtils";


export class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture()
    }
  }
  acceptInvite = (communityID, e) => {
    console.log("accept called");
    e.preventDefault();
    let data = {
      user_id: getMongoUserID(),
      community_id: communityID,
    };
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/acceptInvite", data)
      .then((result) => {
        this.props.unsetLoader();
        this.props.getNotificationData();
        console.log(result);
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };

  rejectInvite = (communityID, e) => {
    e.preventDefault();
    let data = {
      user_id: getMongoUserID(),
      community_id: communityID,
    };
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/rejectInvite", data)
      .then((result) => {
        this.props.unsetLoader();
        this.props.getNotificationData();
        console.log(result);
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };

  render() {
    return (
      <Modal onHide={this.props.hideNav} show={this.props.showNav}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.notificationData && this.props.notificationData.length > 0 &&
            this.props.notificationData.map((details, index) => (
              <div key={index}>
                <Row>
                  <Col xs={2}>
                    <img
                      alt=""
                      width="40px"
                      style={{ borderRadius: "20px", margin: "5px" }}
                      src={this.state.getDefaultRedditProfilePicture}
                    />
                  </Col>
                  <Col xs={4}>{details.communityName}</Col>
                  <Col xs={1}>
                    <span
                      onClick={(e) => this.acceptInvite(details.communityID, e)}
                    >
                      <img src={inviteAcceptedSVG} alt="" />
                    </span>
                  </Col>
                  <Col xs={1}>
                    <span
                      onClick={(e) => this.rejectInvite(details.communityID, e)}
                    >
                      <img src={inviteRejectedSVG} alt="" />
                    </span>
                  </Col>
                  <Col xs={4}>{getRelativeTime(details.time)}</Col>
                </Row>
              </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.hideNav}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Notification;
