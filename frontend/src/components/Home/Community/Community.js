import React, { Component } from "react";
import Post from "./Post";
import { Row, Col, Button } from "react-bootstrap";

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
            {/* <Row style={{ backgroundColor: "blue" }}>Community Name</Row> */}
            <Row style={{ backgroundColor: "yellow" }}>
              <Col xs={8} style={{ backgroundColor: "red" }}>
                <Post />
                <Post />
                <Post />
              </Col>
              <Col>Hello</Col>
            </Row>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Community;
