import React, { Component } from "react";
import Post from "./Post";
import "./community.css";
import gallerySvg from "../../../assets/communityIcons/galleryIcon.svg";
import linkSvg from "../../../assets/communityIcons/linkIcon.svg";
import userSvg from "../../../assets/communityIcons/redditUserLogoIcon.svg";
import { Row, Col, Button, Card } from "react-bootstrap";
// import CreatePost from "./CreatePost";
import { Link } from "react-router-dom";
import Axios from "axios";
import backendServer from "../../../webConfig";
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
    // console.log(props, "COMM PROPS");
    super(props);
    this.state = {
      community_id: props.match.params.community_id
        ? "6089eff68a05a7043c3f3c32"
        : "6089eff68a05a7043c3f3c32",
    };
  }

  componentDidMount() {
    let data = {
      community_id: this.state.community_id,
    };
    this.props.setLoader();
    Axios.post(backendServer + "/getCommunityDetails", data)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ communityDetails: response.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });

    this.props.setLoader();
    Axios.post(backendServer + "/getPostsInCommunity", data)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ posts: response.data }, () => {
          console.log(this.state.posts);
        });
        console.log("in community did mount = ", response.data);
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  render() {
    var postsToRender = [];
    if (this.state.posts) {
      this.state.posts.forEach((post) => {
        postsToRender.push(<Post data={post} {...this.props}></Post>);
      });
    }
    return (
      <React.Fragment>
        <div className="container">
          {/* inside Community ...
          <div>
            Community Name <Button>join</Button>{" "}
          </div> */}
          <Row>
            <p>
              <Row>
                <Col xs={8}>
                  <div className="createPostH">
                    <a>
                      <img
                        style={{ height: "30px", width: "30px" }}
                        alt="User Logo"
                        src={userSvg}
                      />
                    </a>{" "}
                    <Link
                      to={{
                        pathname: "/createPost",
                        params: this.props.match.params.community_id,
                      }}
                    >
                      <input
                        className="createPostInput"
                        placeholder="Create Post"
                        type="text"
                      />
                    </Link>
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
                  {postsToRender}
                </Col>
                <Col>
                  <Row>
                    <Card className="card">
                      <Card.Header className="cardHeader">
                        About Community
                      </Card.Header>
                      <Card.Body>
                        The leading community for cryptocurrency news,
                        discussion & analysis.
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
                      <Card.Body>
                        This is some text within a card body.
                      </Card.Body>
                      <Card.Footer>
                        <Button className="cardButton">Create Post</Button>
                      </Card.Footer>
                    </Card>
                  </Row>
                </Col>
              </Row>
            </p>
          </Row>
        </div>
      </React.Fragment>
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
