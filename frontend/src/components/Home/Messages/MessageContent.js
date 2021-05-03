import React, { Component } from "react";
import { Col, Row, Container, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import backendServer from "../../../webConfig";
import "./message.css";
class MessageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [],
      getUniqueMembers: [],
      loggedinUser: 3
    };
  }
  getMessageFromUser(membeDetail) {
    const user_id = 3;
    axios
      .get(
        `${backendServer}/getMessage?ID=${user_id}&chatWith=${membeDetail.user_id}`
      )
      .then(response => {
        if (response.status == 200) {
          this.setState({
            message: response.data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

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
        return <div key={idx}>{message.message}</div>;
      });
    } else {
      console.log("No message found");
    }
    return (
      <React.Fragment>
        <Container>
          <Col className="changePadding">
            <Card className="changePadding">
              <Card.Header className="text-right">Divya Mittal</Card.Header>
              <Card.Body> {renderMessage}</Card.Body>
              <Card.Footer>
                <Form>
                  <Row>
                    <Col xs={10}>
                      <Form.Control
                        className="form-control"
                        style={{ align: "bottom" }}
                      ></Form.Control>
                    </Col>
                    <Col xs={2}>
                      <Button className="createCommunity">Send</Button>
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
