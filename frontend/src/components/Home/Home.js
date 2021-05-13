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
import createPostRulesSVG from "../../assets/createPostRules.svg";

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
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
  }
  getSearchQueryFromLocation = () => {
    const qR = new URLSearchParams(this.props.location.search);
    return qR.get("q") || "";
  };
  upVote(postId, userVoteDir, index) {
    console.log("upvote req  = ", postId, " ", userVoteDir, " ", index);
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/addVote", {
      entityId: postId,
      userId: getMongoUserID(),
      voteDir: userVoteDir == 1 ? 0 : 1,
    })
      .then((response) => {
        // this.props.unsetLoader();
        console.log("upVOted successfull = ", response);
        console.log("this.state = ", this.state);
        console.log("this.state = ", this.state.dataOfPosts[index].userVoteDir);
        const newPosts = this.state.dataOfPosts.slice();
        newPosts[index].score =
          userVoteDir == 1
            ? newPosts[index].score - 1
            : userVoteDir == 0
            ? newPosts[index].score + 1
            : newPosts[index].score + 2;

        newPosts[index].userVoteDir = userVoteDir == 1 ? 0 : 1;
        console.log("newComments = ", newPosts);
        this.setState({ dataOfPosts: newPosts });
        // this.fetchCommentsWithPostID();
      })
      .catch((err) => {
        // this.props.unsetLoader();
        console.log(err);
      });
  }

  downVote(postId, userVoteDir, index) {
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/addVote", {
      entityId: postId,
      userId: getMongoUserID(),
      voteDir: userVoteDir == -1 ? 0 : -1,
    })
      .then((response) => {
        // this.props.unsetLoader();
        console.log("downvoted successfull = ", response);
        const newPosts = this.state.dataOfPosts.slice();
        newPosts[index].score =
          userVoteDir == -1
            ? newPosts[index].score + 1
            : userVoteDir == 0
            ? newPosts[index].score - 1
            : newPosts[index].score - 2;

        // newComments[index].userVoteDir = response.data.userVoteDir;
        newPosts[index].userVoteDir = userVoteDir == -1 ? 0 : -1;
        console.log("newComments = ", newPosts);
        this.setState({ dataOfPosts: newPosts });
        // this.fetchCommentsWithPostID();
      })
      .catch((err) => {
        // this.props.unsetLoader();
        console.log(err);
      });
  }
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
          if (this.props.location.search === "") {
            this.getDashboardData();
          } else {
            Axios.defaults.headers.common["authorization"] = getToken();
            Axios.post(backendServer + "/searchForPosts", data)
              .then((result) => {
                this.props.unsetLoader();
                let searchRes = [];
                result.data.forEach((post, index) => {
                  searchRes.push(
                    <Post
                      upVote={this.upVote}
                      downVote={this.downVote}
                      index={index}
                      data={post}
                      {...this.props}
                    ></Post>
                  );
                });
                this.setState({ searchResults: searchRes });
              })
              .catch((err) => {
                this.props.unsetLoader();
                console.log(err);
              });
          }
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
    console.log("fetching!!!!!!!!!!!");
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
      this.state.dataOfPosts.forEach((post, index) => {
        postsToRender.push(
          <Post
            upVote={this.upVote}
            downVote={this.downVote}
            index={index}
            data={post}
            {...this.props}
          ></Post>
        );
      });
    }
    return (
      <React.Fragment>
        <Row
          style={{
            paddingTop: "70px",
            background: this.props.darkMode ? "black" : "#DAE0E6",
            boxShadow: "rgb(119 119 119) 0px 0px 5px",
          }}
        >
          <Col sm={8}>
            <div style={{ float: "right", padding: "1rem", width: "100%" }}>
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
          <Col sm={4} style={{ padding: "1% 5% 1% 1%" }}>
            <Row>
              <Card className="card">
                <Card.Header className="cardHeader">
                  <img alt="" height="40px" src={createPostRulesSVG} /> Welcome
                  to Reddit
                </Card.Header>
                <Card.Body>
                  <ol>
                    <li>Remember the human</li>
                    <li>Behave like you would in real life</li>
                    <li>Look for the original source of content</li>
                    <li>Search for duplicates before posting</li>
                    <li>Follow the other rules</li>
                  </ol>
                </Card.Body>
              </Card>
            </Row>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Home;
