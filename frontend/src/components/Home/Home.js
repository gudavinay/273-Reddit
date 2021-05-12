import React, { Component } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Post from "./Community/Post";
import Axios from "axios";
import backendServer from "../../webConfig";
import {
  getMongoUserID,
  getToken,
  sortByNoOfUser,
  sortByTime,
  sortByComments,
} from "../../services/ControllerUtils";
import HomeSearchResults from "./HomeSearchResults";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: this.getSearchQueryFromLocation(),
      searchResults: [],
      sortby: "Date",
      sortType: "desc",
    };
    console.log("PROPS IN HOME", this.props);
  }
  getSearchQueryFromLocation = () => {
    const qR = new URLSearchParams(this.props.location.search);
    return qR.get("q") || "";
  };
  componentDidUpdate(prevProps) {
    if (prevProps.location.search != this.props.location.search) {
      this.setState(
        {
          searchText: this.getSearchQueryFromLocation(),
        },
        () => {
          let data = {
            search: this.state.searchText,
            user_id: getMongoUserID(),
          };
          this.props.setLoader();
          Axios.defaults.headers.common["authorization"] = getToken();
          Axios.post(backendServer + "/searchForPosts", data)
            .then((result) => {
              this.props.unsetLoader();
              let searchRes = [];
              result.data.forEach((post) => {
                searchRes.push(<Post data={post} {...this.props}></Post>);
              });
              this.setState({ searchResults: searchRes });
            })
            .catch((err) => {
              this.props.unsetLoader();
              console.log(err);
            });
        }
      );
    }
  }
  async componentDidMount() {
    this.getDashboardData();
  }
  getDashboardData = async () => {
    let data = {
      user_id: getMongoUserID(),
    };
    // console.log(data);
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/getAllPostsWithUserId", data)
      .then((result) => {
        console.log(result.data);
        this.props.unsetLoader();
        this.setState({ dataOfPosts: result.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };
  SortType = (e) => {
    this.setState(
      {
        sortType: e.target.value,
      },
      () => {
        console.log(this.state.sortType);
        console.log(this.state.sortby);
      }
    );
    this.Sorting(this.state.sortby, e.target.value);
  };

  async Sorting(attribute, type) {
    let sortValue;
    if (attribute == "Date") {
      console.log("sorting by date and type " + type);
      sortValue = await sortByTime(this.state.dataOfPosts, type);
    } else if (attribute == "User") {
      console.log("sorting by User and type " + type);
      sortValue = await sortByNoOfUser(this.state.dataOfPosts, type);
    } else if (attribute == "Comments") {
      console.log("sorting by Comments and type " + type);
      sortValue = sortByComments(this.state.dataOfPosts, type);
    }
    console.log(sortValue);
    this.setState({
      dataOfPosts: sortValue,
    });
  }

  SortItems = (e) => {
    this.setState({
      sortby: e.target.value,
    });
    this.Sorting(e.target.value, this.state.sortType);
  };
  render() {
    var postsToRender = [];
    if (this.state.dataOfPosts) {
      this.state.dataOfPosts.forEach((post) => {
        postsToRender.push(<Post data={post} {...this.props}></Post>);
      });
    }
    return (
      <React.Fragment>
        <Row
          style={{
            paddingTop: "70px",
            background: this.props.darkMode ? "black" : "#DAE0E6",
          }}
        >
          <Col sm={8}>
            <div style={{ float: "right", padding: "1rem" }}>
              {/* <Alert variant="danger">
                <button onClick={() => this.props.setLoader()}>
                  SET LOADER
                </button>
                <button onClick={() => this.props.unsetLoader()}>
                  UNSET LOADER
                </button>
              </Alert> */}
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
                        <option value="Comments">Comments</option>
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
                  {this.state.searchResults.length ? (
                    <HomeSearchResults
                      data={this.state.searchResults}
                    ></HomeSearchResults>
                  ) : (
                    postsToRender
                  )}
                </Card.Body>
              </Card>

              {/* <Post content="post 1" />
              <Post content="post 2" />
              <Post content="post 3" />
              <Post content="post 4" />
              <Post content="post 5" />
              <Post content="post 6" />
              <Post content="post 7" /> */}
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
