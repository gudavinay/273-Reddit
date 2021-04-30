import React, { Component } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import Post from "./Community/Post";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    console.log("PROPS IN HOME", this.props);
  }

  render() {
    return (
      <React.Fragment>
        <Row style={{ paddingTop: "70px", background: this.props.darkMode ? "black" : "#DAE0E6" }}>
          <Col sm={8}>
            <div style={{ float: "right", padding: "1rem" }}>
              <Alert variant="danger">
                <button onClick={() => this.props.setLoader()}>SET LOADER</button>
                <button onClick={() => this.props.unsetLoader()}>UNSET LOADER</button>
              </Alert>
              <Post content="post 1" />
              <Post content="post 2" />
              <Post content="post 3" />
              <Post content="post 4" />
              <Post content="post 5" />
              <Post content="post 6" />
              <Post content="post 7" />
            </div>
          </Col>
          <Col sm={4}>
            <div style={{ padding: "1rem" }}>
              widget1
              <br />
              widget2
              <br />
              widget3
              <br />
              widget4
              <br />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Home;
