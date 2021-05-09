import React, { Component } from "react";
import Post from "./Post";
import "./community.css";
import gallerySvg from "../../../assets/communityIcons/galleryIcon.svg";
import linkSvg from "../../../assets/communityIcons/linkIcon.svg";
import userSvg from "../../../assets/communityIcons/redditUserLogoIcon.svg";
import { Row, Col, Card, Collapse, Fade, Carousel, } from "react-bootstrap";
// import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import axios from "axios";
import backendServer from "../../../webConfig";
import { getDefaultRedditProfilePicture, getMongoUserID } from "../../../services/ControllerUtils";
// import { withStyles } from "@material-ui/core/styles";
// import { useTheme } from "@material-ui/core/styles";

// import { useTheme } from '@react-navigation/native';
// eslint-disable-next-line no-unused-vars
// const styles = theme => ({
//   rowBackround: {
//     backgroundColor: theme.palette.background,
//   }
// });
class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      community_id: props.location.pathname ? this.props.location.pathname.replace("/community/", "") : "",
    };
  }

  componentDidMount = async () => {
    this.props.setLoader();
    axios
      .get(`${backendServer}/getCommunityDetails?ID=${this.state.community_id}`)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ communityDetails: response.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });

    this.props.setLoader();
    axios
      .get(`${backendServer}/getPostsInCommunity?ID=${this.state.community_id}`)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ posts: response.data }, () => { });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };

  render() {
    var postsToRender = [];
    if (this.state.posts) {
      this.state.posts.forEach((post) => {
        postsToRender.push(<Post data={post} {...this.props}></Post>);
      });
    }
    var participationButton = null;
    var userStatusInCommunity = this.state.communityDetails?.listOfUsers.find(user => user.userID == getMongoUserID());
    if (userStatusInCommunity) {
      if (userStatusInCommunity.isAccepted == 1) {
        participationButton = (<button className="form-control" style={{ display: 'block', borderRadius: '30px', background: "#e17157", color: "white" }} onClick={() => {

          this.props.setLoader();
          axios.post(`${backendServer}/userLeaveRequestFromCommunity`, { community_id: this.state.community_id, user_id: getMongoUserID() })
            .then((response) => {
              this.props.unsetLoader();
              this.setState({ communityDetails: response })
            })
            .catch((err) => {
              this.props.unsetLoader();
              console.log(err);
            });

        }}>Leave</button>)
      } else if (userStatusInCommunity.isAccepted == -1) {
        participationButton = (<button disabled className="form-control" style={{ display: 'block', borderRadius: '30px', background: "#e17157", color: "white" }}>Request to join denied.</button>);
      } else {
        participationButton = (<button disabled className="form-control" style={{ display: 'block', borderRadius: '30px', background: "#e17157", color: "white" }}>Request Pending</button>);
      }
    } else {
      participationButton = (<button className="form-control" style={{ display: 'block', borderRadius: '30px', background: "#e17157", color: "white" }} onClick={() => {

        this.props.setLoader();
        axios.post(`${backendServer}/userJoinRequestToCommunity`, { community_id: this.state.community_id, user_id: getMongoUserID() })
          .then((response) => {
            this.props.unsetLoader();
            this.setState({ communityDetails: response })
          })
          .catch((err) => {
            this.props.unsetLoader();
            console.log(err);
          });

      }}>Join</button>);
    }


    return (
      <React.Fragment>
        <Row className="communityHeaderInfo">
          <Col sm={1}>
            <img width="40px" style={{ borderRadius: "20px", margin: "5px" }} src={getDefaultRedditProfilePicture()} alt="" />
          </Col>
          <Col sm={7}>
            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{this.state.communityDetails?.communityName}</div>
            <div style={{ fontSize: '13px' }}>{this.state.communityDetails?.communityDescription}</div>
          </Col>
          <Col sm={2}>
            {participationButton}
          </Col>
        </Row>
        <div className="container">

          <Row>
            <div>
              <Row>
                <Col xs={8}>
                  <div className="createPostH">
                    <a>
                      <img
                        style={{ height: "30px", width: "30px", border: "1px solid", borderRadius: "27px", padding: "2px", margin: "3px" }}
                        alt="User Logo"
                        src={userSvg}

                      />
                    </a>{" "}
                    <Link
                      to={`/createPost/${this.state.community_id}`}
                    >
                      <input
                        className="createPostInput"
                        placeholder="Create Post"
                        type="text"
                      />
                    </Link>
                    <a className="galleryAnchor">
                      <img
                        style={{ height: "30px", width: "22px" }}
                        alt="Gallery Logo"
                        src={gallerySvg}
                      />
                    </a>
                    <a className="galleryAnchor">
                      <img
                        style={{ height: "30px", width: "22px" }}
                        alt="Link Logo"
                        src={linkSvg}
                      />
                    </a>
                  </div>
                  {postsToRender}
                </Col>
                <Col>

                  {(this.state.communityDetails?.imageURL && this.state.communityDetails?.imageURL.length > 0) ? < Row >
                    <Card className="card">
                      <Card.Header className="cardHeader">
                        r/{this.state.communityDetails?.communityName}&apos;s images
                      </Card.Header>
                      <Card.Body>
                        <Carousel interval={1500}>
                          {this.state.communityDetails?.imageURL.map(image => {
                            <Carousel.Item>
                              <img alt={image.url} style={{ height: '100%', width: '100%' }}></img>
                            </Carousel.Item>
                          })}
                        </Carousel>
                      </Card.Body>
                    </Card>
                  </Row> : ""}

                  <Row>
                    <Card className="card">
                      <Card.Header className="cardHeader">
                        r/{this.state.communityDetails?.communityName}&apos;s Rules
                      </Card.Header>
                      <Card.Body>
                        {this.state.communityDetails?.rules.map((rule, index) => {
                          var normalView = [], expandedView = [];

                          if (index < 5) {
                            normalView.push(<div key={rule._id}>
                              <strong>{rule.title}</strong>: {rule.description}
                            </div>);
                          } else if (index == 5) {
                            normalView.push(<div className="upArrowRotate" style={{ display: !this.state.showMoreRules ? "block" : "none", textAlign: 'center' }} onClick={() => this.setState((state) => ({ showMoreRules: !state.showMoreRules }))}>
                              <i className="fa fa-angle-double-down" />
                            </div>)
                          } else {
                            expandedView.push(<div key={rule._id}><strong>{rule.title}</strong>: {rule.description}</div>);
                          }
                          return (<div key="">
                            {normalView}
                            <Collapse in={this.state.showMoreRules}>
                              <Fade>
                                <div>
                                  {expandedView}
                                  {this.state.communityDetails.rules.length - 1 == index ?
                                    <div className="downArrowRotate" style={{ display: this.state.showMoreRules ? "block" : "none", textAlign: 'center' }} onClick={() => this.setState((state) => ({ showMoreRules: !state.showMoreRules }))}>
                                      <i className="fa fa-angle-double-up" />
                                    </div> : ""}
                                </div>
                              </Fade>
                            </Collapse>
                          </div>)
                        })}
                      </Card.Body>
                    </Card>
                  </Row>
                  <Row>
                    <Card className="card">
                      <Card.Header className="cardHeader">
                        r/{this.state.communityDetails?.communityName}&apos;s interested topics
                      </Card.Header>
                      <Card.Body>
                        {this.state.communityDetails?.topicSelected.map((topic, index) => {
                          var normalView = [], expandedView = [];

                          if (index < 5) {
                            normalView.push(<div key={topic._id}>
                              <strong>{topic.topic}</strong>
                            </div>);
                          } else if (index == 5) {
                            normalView.push(<div className="upArrowRotate" style={{ display: !this.state.showMoreTopics ? "block" : "none", textAlign: 'center' }} onClick={() => this.setState((state) => ({ showMoreTopics: !state.showMoreTopics }))}>
                              <i className="fa fa-angle-double-down" />
                            </div>)
                          } else {
                            expandedView.push(<div key={topic._id}><strong>{topic.topic}</strong></div>);
                          }
                          return (<div key="">
                            {normalView}
                            <Collapse in={this.state.showMoreTopics}>
                              <Fade>
                                <div>
                                  {expandedView}
                                  {this.state.communityDetails.topicSelected.length - 1 == index ?
                                    <div className="downArrowRotate" style={{ display: this.state.showMoreTopics ? "block" : "none", textAlign: 'center' }} onClick={() => this.setState((state) => ({ showMoreTopics: !state.showMoreTopics }))}>
                                      <i className="fa fa-angle-double-up" />
                                    </div> : ""}
                                </div>
                              </Fade>
                            </Collapse>
                          </div>)
                        })}
                      </Card.Body>
                    </Card>
                  </Row>
                </Col>
              </Row>
            </div>
          </Row>
        </div>
      </React.Fragment >
    );
  }
}
// Wrap and export
// eslint-disable-next-line react/display-name
// export default function (props) {
//   const theme = useTheme();

//   return <Community {...props} theme={theme} />;
// }

export default Community;
// export default withStyles(styles, { withTheme: true })(Community);
// export default withStyles(styles)(Community);
