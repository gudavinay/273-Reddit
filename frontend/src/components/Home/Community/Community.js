import React, { Component } from "react";
import Post from "./Post";
import "./community.css";
import { Row, Col, Button, Card } from "react-bootstrap";

class Community extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          inside Community ...
          <div>
            Community Name <Button>join</Button>{" "}
          </div>
          <Row>
            <Row style={{ backgroundColor: "yellow" }}>
              <Col xs={8} style={{ backgroundColor: "red" }}>
                <Post />
                <Post />
                <Post />
              </Col>
              <Col>
                <Row>
                  <Card
                    style={{
                      paddingLeft: "0px",
                      paddingRight: "0px",
                      margin: "10px",
                    }}
                  >
                    <Card.Header className="cardHeader">
                      About Community
                    </Card.Header>
                    <Card.Body>
                      The leading community for cryptocurrency news, discussion
                      & analysis.
                    </Card.Body>
                    <Card.Footer>
                      <Button className="cardButton">Create Post</Button>
                    </Card.Footer>
                  </Card>
                </Row>
                <Row>
                  <Card className="card">
                    <Card.Header className="cardHeader">
                      r/Community Rules
                    </Card.Header>
                    <Card.Body>This is some text within a card body.</Card.Body>
                    <Card.Footer>
                      <Button className="cardButton">Create Post</Button>
                    </Card.Footer>
                  </Card>
                </Row>
              </Col>
            </Row>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Community;
