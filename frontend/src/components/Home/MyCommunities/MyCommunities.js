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
      error: {},
      success: false,
      communityName: "",
      myCommunity: [],
      page: 1,
      size: 2,
      count: 0
    };
  }

  getMyCommunities(page) {
    const ownerID = getMongoUserID();
    this.props.setLoader();
    console.log(
      `${backendServer}/myCommunity?ID=${ownerID}&page=${page}&size=${this.state.size}`
    );
    axios
      .get(
        `${backendServer}/myCommunity?ID=${ownerID}&page=${page}&size=${this.state.size}`
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
    this.getMyCommunities(this.state.page);
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
  PageSizeChange = e => {
    console.log(e);
    this.setState({
      size: Number(e.target.value)
    });
    this.getMyCommunities();
  };

  PageChange = e => {
    console.log(e);
    this.setState({
      page: Number(e.target.textContent)
    });
    this.getMyCommunities(Number(e.target.textContent));
  };

  render() {
    let redirectVar = null;
    let myCommunities = null;
    if (this.state.success)
      redirectVar = <Redirect to="/createCommunity"></Redirect>;
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
              <Link
                to={{
                  pathname: `/community/${community._id}`,
                  state: { comm_id: community._id }
                }}
              >
                <Button className="createCommunity">View More Details</Button>
              </Link>
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
                {/* <div style={{ marginRight: "10px", fontSize: "12px" }}>
                  Rows per page:
                </div>
                <div>
                  <select
                    name="pagesize"
                    id="pagesize"
                    onChange={this.PageSizeChange}
                  >
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select> */}
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
              {/* </div> */}
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
