import React, { Component } from "react";
import { Col, Row, Container, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
import "./message.css";
import {
  getSQLUserID,
  getUserProfile,
  getRelativeTime,
  getToken
} from "../../../services/ControllerUtils";
class MessageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      messageTobeSent: "",
      getUniqueMembers: []
    };
  }
  getMessageFromUser(membeDetail) {
    const user_id = getSQLUserID();
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(
        `${backendServer}/getMessage?ID=${user_id}&chatWith=${membeDetail.user_id}`
      )
      .then(response => {
        if (response.status == 200) {
          this.setState({
            message: response.data,
            messageTobeSent: ""
          });
          console.log(response.data);
        }
      })
      .catch(error => {
        this.setState({
          message: "",
          messageTobeSent: ""
        });
        console.log(error);
      });
  }

  sendMessage = e => {
    e.preventDefault();
    const user_id = getSQLUserID();
    console.log(this.state.messageTobeSent);
    const data = {
      message: this.state.messageTobeSent,
      sent_by: user_id,
      sent_to: this.props.chattedWith.user_id
    };
    axios
      .post(`${backendServer}/sendMessage`, data)
      .then(response => {
        if (response.status == 200) {
          this.getMessageFromUser(this.props.chattedWith);
          console.log(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidUpdate(prevState) {
    if (prevState.chattedWith.user_id !== this.props.chattedWith.user_id) {
      this.getMessageFromUser(this.props.chattedWith);
    }
  }
  componentDidMount() {
    this.getMessageFromUser(this.props.chattedWith);
  }

  render() {
    let renderMessage = null;
    if (this.state.message.length > 0) {
      renderMessage = this.state.message.map((message, idx) => {
        if (message.sent_by == getSQLUserID())
          return (
            <div key={idx} className="text-right">
              <label className="changePadding messageBox border">
                {message.message}
              </label>{" "}
              <br />
              <label style={{ fontSize: "10px", color: "Grey" }}>
                {getRelativeTime(message.createdAt)}
              </label>
            </div>
          );
        else
          return (
            <div key={idx} className="text-left">
              <strong>{this.props.chattedWith.name}</strong>
              <br />
              <label className="changePadding messageBox border">
                {message.message}
              </label>{" "}
              <br />
              <label style={{ fontSize: "10px", color: "Grey" }}>
                {getRelativeTime(message.createdAt)}
              </label>
            </div>
          );
      });
    } else {
      console.log("No message found");
    }
    return (
      <React.Fragment>
        <Container>
          <Col className="changePadding">
            <Card className="changePadding">
              <Card.Header className="text-right">
                {getUserProfile() != null ? getUserProfile().name : "Username"}
              </Card.Header>
              <Card.Body className="messageBody"> {renderMessage}</Card.Body>
              <Card.Footer>
                <Form>
                  <Row>
                    <Col xs={10}>
                      <Form.Control
                        type="text"
                        className="form-control"
                        style={{ align: "bottom" }}
                        value={this.state.messageTobeSent}
                        onChange={e =>
                          this.setState({ messageTobeSent: e.target.value })
                        }
                      ></Form.Control>
                    </Col>
                    <Col xs={2}>
                      <Button
                        className="createCommunity"
                        onClick={this.sendMessage}
                      >
                        Send
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Form></Form>
              </Card.Footer>
            </Card>
          </Col>
        </Container>
      </React.Fragment>
    );
  }
}

export default MessageContent;
