import React, { Component } from "react";
import { Col, Row } from "reactstrap";

class MyCommunitiesModeration extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ height: "90vh", backgroundColor: "lightgray" }}>
          <Row>
            <Col>List of communitites</Col>
            <Col>List of users</Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default MyCommunitiesModeration;
