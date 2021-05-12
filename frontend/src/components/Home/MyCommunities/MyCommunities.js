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
import {
  getMongoUserID,
  sortByTime,
  sortByNoOfUser,
  sortByPost,
  getToken
} from "../../../services/ControllerUtils";
import { TablePagination } from "@material-ui/core";
import NoImage from "../../../assets/NoImage.png";

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
      count: 0,
      sortby: "",
      sortType: "desc"
    };
  }

  getMyCommunities(page, size) {
    const ownerID = getMongoUserID();
    this.props.setLoader();
    // console.log(
    //   `${backendServer}/myCommunity?ID=${ownerID}&page=${page}&size=${size}`
    // );
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(
        `${backendServer}/getCommunitiesForOwner?ID=${ownerID}&page=${page}&size=${size}&search=${""}`
      )
      .then(response => {
        this.props.unsetLoader();
        if (response.status == 200) {
          console.log(response.data);
          this.setState({
            myCommunity: response.data.com,
            count: response.data.total
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
    axios.defaults.headers.common["authorization"] = getToken();
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
      this.props.setLoader();
      const data = {
        community_id: community._id
      };
      axios.defaults.headers.common["authorization"] = getToken();
      axios
        .post(`${backendServer}/deleteCommunity`, data)
        .then(response => {
          this.props.unsetLoader();
          if (response.status == 200) {
            this.getMyCommunities(this.state.page, this.state.size);
            alert("Community deleted successfully");
          }
        })
        .catch(error => {
          this.props.unsetLoader();
          console.log("error " + error);
        });
    } else {
      console.log("Not sure to delete the community");
    }
  };

  SortType = e => {
    this.setState({
      sortType: e.target.value
    });
    this.Sorting(this.state.sortby, e.target.value);
  };

  Sorting(attribute, type) {
    let sortValue;
    if (attribute == "Date") {
      sortValue = sortByTime(this.state.myCommunity, type);
    } else if (attribute == "User") {
      sortValue = sortByNoOfUser(this.state.myCommunity, type);
    } else {
      sortValue = sortByPost(this.state.myCommunity, type);
    }
    this.setState({
      myCommunity: sortValue
    });
  }

  SortItems = e => {
    this.setState({
      sortby: e.target.value
    });
    this.Sorting(e.target.value, this.state.sortType);
  };

  render() {
    let redirectVar = null;
    let myCommunities = null;
    let imageCaraosel = null;
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
        if (community.imageURL.length > 0) {
          imageCaraosel = community.imageURL.map((image, idx) => {
            return (
              <Carousel.Item key={idx} interval={1000}>
                <img
                  className="myCarasoulSize"
                  src={image.url}
                  alt="First slide"
                />
              </Carousel.Item>
            );
          });
        } else {
          imageCaraosel = (
            <Carousel.Item interval={1000}>
              <img className="myCarasoulSize" src={NoImage} alt="First slide" />
            </Carousel.Item>
          );
        }
        return (
          <Card key={idx}>
            <Row>
              <Col xs={4}>
                <Carousel>{imageCaraosel}</Carousel>
              </Col>
              <Col>
                <div className="bodyOverflow">
                  <strong>Community Name:</strong>
                  {community.communityName}
                  <br />
                  <strong> Description:</strong>
                  {community.communityDescription}
                  <br />
                  <strong>Total Users:</strong>
                  {community.acceptedUsersSQLIds.length + 1}
                  <br />
                  <strong>No of Post:</strong>
                  {community.NoOfPost}
                  <br />
                </div>
              </Col>
            </Row>
            <Card.Footer className="text-right">
              <Link to={`/community/${community._id}`}>
                <Button className="createCommunity">View More Details</Button>
              </Link>
              <Link to={`/createCommunity?id=${community._id}`}>
                <button type="button" className="btn" title="Edit Community">
                  <i className="fas fa-edit"></i>
                </button>
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
              <Card>
                <Card.Header>
                  <Row>
                    <Col xs={2}>Sort By</Col>
                    <Col xs={3} style={{ marginLeft: "-80px" }}>
                      <select
                        className="form-control"
                        onChange={this.SortItems}
                      >
                        <option value="Date">Created Date</option>
                        <option value="Post">Post</option>
                        <option value="User">User</option>
                      </select>
                    </Col>
                    <Col xs={2}>
                      <select className="form-control" onChange={this.SortType}>
                        <option value="desc">Decending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
              </Card>
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
                        onKeyDown={evt =>
                          evt.key === " " && evt.preventDefault()
                        }
                        onChange={e =>
                          this.setState({ communityName: e.target.value })
                        }
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
