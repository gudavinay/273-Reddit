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
import { getMongoUserID } from "../../../services/ControllerUtils";
import { TablePagination } from "@material-ui/core";

class MyCommunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      success: false,
      communityName: "",
      myCommunity: [],
      page: 0,
      size: 2,
      count: 0
    };
  }

  getMyCommunities(page, size) {
    const ownerID = getMongoUserID();
    this.props.setLoader();
    console.log(
      `${backendServer}/myCommunity?ID=${ownerID}&page=${page}&size=${size}`
    );
    axios
      .get(
        `${backendServer}/myCommunity?ID=${ownerID}&page=${page}&size=${size}`
      )
      .then(response => {
        this.props.unsetLoader();
        if (response.status == 200) {
          this.setState({
            myCommunity: response.data,
            count: response.data[0].totalRecords
          });
        }
      })
      .catch(error => {
        this.props.unsetLoader();
        console.log("error " + error);
      });
  }

  componentDidMount() {
    this.getMyCommunities(this.state.page, this.state.size);
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
            success: true,
            error: ""
          });
        } else if (response.status == 400) {
          this.setState({
            error: "Community name is not unique"
          });
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({
          error: "Community name is not unique"
        });
      });
  };

  PageSizeChange = e => {
    this.setState({
      size: Number(e.target.value),
      page: 0
    });
    this.getMyCommunities(0, Number(e.target.value));
  };

  PageChange = (e, page) => {
    this.setState({
      page: Number(page)
    });
    this.getMyCommunities(Number(page), this.state.size);
  };

  deleteCommunity = (e, community) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this comment?")) {
      const data = {
        community_id: community._id
      };
      axios
        .post(`${backendServer}/deleteCommunity`, data)
        .then(response => {
          if (response.status == 200) {
            let allCommunity = this.state.myCommunity;
            allCommunity.pop(community);
            this.setState({
              mycommunity: allCommunity
            });
            alert("Community deleted successfully");
          }
        })
        .catch(error => console.log("error " + error));
    } else {
      console.log("Not sure to delete the community");
    }
  };

  render() {
    let redirectVar = null;
    let myCommunities = null;
    if (this.state.success)
      redirectVar = (
        <Redirect
          to={{
            pathname: `/createCommunity/${this.state.communityName}`
          }}
        />
      );
    if (this.state.myCommunity.length > 0) {
      myCommunities = this.state.myCommunity.map((community, idx) => {
        return (
          <Card key={idx}>
            <Row>
              <Col xs={4}>
                <Carousel>
                  <Carousel.Item interval={1000}>
                    <img
                      className="myCarasoulSize"
                      src={image1}
                      alt="First slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item interval={1000}>
                    <img className="myCarasoulSize" src={image2} />
                  </Carousel.Item>
                  <Carousel.Item interval={1000}>
                    <img className="myCarasoulSize" src={image3} />
                  </Carousel.Item>
                </Carousel>
              </Col>
              <Col xs={6}>
                <p>
                  <strong>Community Name:</strong>
                  {community.communityName}
                  <br />
                  <strong> Description:</strong>
                  {community.communityDescription}
                  <br />
                  <strong>Total Users:</strong>
                  {community.listOfUsers.length + 1}
                  <br />
                  <strong>No of Post:</strong>
                  {community.count}
                  <br />
                </p>
              </Col>
            </Row>
            <Card.Footer className="text-right">
              <Link to={`/community/${community._id}`}>
                <Button className="createCommunity">View More Details</Button>
              </Link>
              <button
                type="button"
                className="btn"
                title="Delete Community"
                onClick={e => this.deleteCommunity(e, community)}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </Card.Footer>
          </Card>
        );
      });
    }
    return (
      <React.Fragment>
        {redirectVar}
        <Container fluid>
          <Row>
            <Col xs={8}>
              <div className="card">
                {myCommunities}
                <TablePagination
                  count={this.state.count}
                  page={this.state.page}
                  onChangePage={this.PageChange}
                  rowsPerPage={this.state.size}
                  onChangeRowsPerPage={this.PageSizeChange}
                  variant="outlined"
                  color="primary"
                  rowsPerPageOptions={[2, 5, 10]}
                />
              </div>
            </Col>
            <Col xs={4}>
              <Card>
                <Form
                  className="form-stacked"
                  onSubmit={this.CheckIfTheCommunityCanBeCreated}
                >
                  <Card.Header>Create Community</Card.Header>
                  <Card.Body>
                    <div
                      id="errorLogin"
                      hidden={this.state.error != "" ? false : true}
                      className="alert alert-danger"
                      role="alert"
                    >
                      {this.state.error}
                    </div>
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
                      />
                    </Form.Group>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button type="submit" className="createCommunity">
                      Create Community
                    </Button>
                  </Card.Footer>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default MyCommunities;
