import React, { Component } from "react";
import Post from "./Post";
import "./community.css";
import gallerySvg from "../../../assets/communityIcons/galleryIcon.svg";
import linkSvg from "../../../assets/communityIcons/linkIcon.svg";
import userSvg from "../../../assets/communityIcons/redditUserLogoIcon.svg";
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
            <Row style={{ backgroundColor: "#BBBDBF" }}>
              <Col xs={8}>
                <div className="createPostH">
                  <a>
                    <img
                      style={{ height: "30px", width: "30px" }}
                      alt="User Logo"
                      src={userSvg}
                    />
                  </a>{" "}
                  <input
                    className="createPostInput"
                    placeholder="Create Post"
                    type="text"
                  ></input>
                  <a className="galleryAnchor">
                    <img
                      style={{ height: "30px", width: "30px" }}
                      alt="Gallery Logo"
                      src={gallerySvg}
                    />
                  </a>
                  <a className="galleryAnchor">
                    <img
                      style={{ height: "30px", width: "30px" }}
                      alt="Link Logo"
                      src={linkSvg}
                    />
                  </a>
                </div>
                <Post />
                <Post />
                <Post />
              </Col>
              <Col>
                <Row>
                  <Card className="card">
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
