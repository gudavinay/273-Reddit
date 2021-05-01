import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Carousel,
  Row,
  Col,
  Container,
  Card,
  Form
} from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import backendServer from "../../../webConfig";
import "./mycommunity.css";
import image1 from "../../../assets/CommunityImage1.jpeg";
import image2 from "../../../assets/CommunityImage2.jpeg";
import image3 from "../../../assets/CommunityImage3.jpeg";

class MyCommunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      success: false,
      communityName: ""
    };
  }

  CheckIfTheCommunityCanBeCreated = e => {
    e.preventDefault();
    const data = {
      communityName: this.state.communityName
    };
    axios
      .post(`${backendServer}/checkForUniqueCommunity`, data)
      .then(response => {
        if (response.status == 200) {
          this.setState({
            success: true
          });
        }
      })
      .catch(error => console.log("error " + error));
  };

  render() {
    let redirectVar = null;
    if (this.state.success) redirectVar = <Redirect to="/createCommunity" />;

    return (
      <React.Fragment>
        {redirectVar}
        <Container>
          <Row>
            <Col xs={8}>
              <Card>
                <Carousel>
                  <Carousel.Item interval={500}>
                    <img src={image1} alt="First slide" />
                    <Carousel.Caption>
                      <h3>First slide label</h3>
                      <p>
                        Nulla vitae elit libero, a pharetra augue mollis
                        interdum.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item interval={500}>
                    <img src={image2} />
                  </Carousel.Item>
                  <Carousel.Item interval={500}>
                    <img src={image3} />
                  </Carousel.Item>
                </Carousel>
              </Card>
            </Col>
            <Col xs={4}>
              <Card>
                <Card.Header>Create Community</Card.Header>
                <Card.Body>
                  <Form className="form-stacked">
                    <Form.Group>
                      <Form.Label className="community-label" htmlFor="name">
                        Name<sup>*</sup>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="name"
                        name="name"
                        onChange={e =>
                          this.setState({ communityName: e.target.value })
                        }
                        aria-describedby="passwordHelpBlock"
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Link to="/createCommunity">
                    <Button
                      className="createCommunity"
                      onClick={this.CheckIfTheCommunityCanBeCreated}
                    >
                      Create Community
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default MyCommunities;
