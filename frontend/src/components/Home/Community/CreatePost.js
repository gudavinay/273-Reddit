import React, { Component } from "react";
// import Tabs from 'react-bootstrap/Tabs';
import Tab from "react-bootstrap/Tab";
import { Button, Card, Col, Nav, Row } from "react-bootstrap";
import createPostRulesSVG from "../../../assets/createPostRules.svg";
import Axios from "axios";
import backendServer from "../../../webConfig";
import { getMongoUserID, getToken } from "../../../services/ControllerUtils";
import "./CreatePost.css";
import { Collapse, Fade } from "react-bootstrap";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      community_id: props.location.pathname
        ? this.props.location.pathname.replace("/createPost/", "")
        : "",
      type: "0",
      title: null,
      link: null,
      description: null,
      user_id: getMongoUserID(),
    };
    console.log("PROPS AND STATE in create post", this.props, this.state);
  }

  uploadImage = e => {
    if (e.target.files) {
      let data = new FormData();
      data.append("file", e.target.files[0]);
      this.props.setLoader();
      Axios.post(`${backendServer}/upload`, data)
        .then(response => {
          this.props.unsetLoader();
          console.log(response);
          if (response.data && response.data[0] && response.data[0].Location)
            this.setState({ postImageUrl: response.data[0].Location })
        })
        .catch(error => {
          this.props.unsetLoader();
          console.log("error " + error);
        });
    }
  };

  render() {
    const titleTag = (
      <input
        type="text"
        style={{ margin: "15px 0" }}
        className="form-control"
        placeholder="Title"
        id="title"
        name="post"
        onChange={(e) => {
          this.setState({ title: e.target.value });
        }}
      />
    );
    const postButton = (
      <Button
        type="submit"
        style={{
          display: "block",
          float: "right",
          margin: "10px",
          width: "82px",
          borderRadius: "50px",
          backgroundColor: this.state.title ? "#0266b3" : "#777",
          color: "white",
          fontWeight: "500",
        }}
        variant="light"
      >
        Post
      </Button>
    );
    return (
      <React.Fragment>
        {/* inside CreatePost ... {this.props.content} */}
        <Row style={{ padding: "30px" }}>
          <Col sm={1}></Col>
          <Col sm={7}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (this.state.title) {
                  this.props.setLoader();
                  Axios.defaults.headers.common["authorization"] = getToken();
                  Axios.post(backendServer + "/createPost", this.state)
                    .then((result) => {
                      this.props.unsetLoader();
                      console.log(result);
                    })
                    .catch((err) => {
                      this.props.unsetLoader();
                      console.log(err);
                    });
                }
              }}
            >
              {/* {JSON.stringify(this.state)} */}
              {/* <Tabs defaultActiveKey="0" id="tabs" onSelect={(eventKey) => { this.setState({ type: eventKey }) }}>
                                <Tab eventKey="0" title="Post" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Text (optional)" id="description" name="description" onChange={(e) => { this.setState({ description: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="2" title="Images" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <input type="file" className="form-control" id="files" name="files" accept="image/*" multiple></input>
                                    {postButton}
                                </Tab>
                                <Tab eventKey="1" title="Link" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Url" id="link" name="link" onChange={(e) => { this.setState({ link: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="poll" title="Poll" disabled style={{ padding: '3%' }}>
                                </Tab>
                            </Tabs> */}

              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="0"
                onSelect={(eventKey) => {
                  this.setState({
                    type: eventKey,
                    title: null,
                    link: null,
                    description: null,
                  });
                }}
              >
                <Row>
                  <Row>
                    <Nav variant="tabs" className="flex-row">
                      <Nav.Item>
                        <Nav.Link className="navLinkV" eventKey="0">
                          <span className="tabElement">
                            <i
                              className="fa fa-comment-alt"
                              style={{ width: "15px", margin: "10px" }}
                            />
                            Post
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="navLinkV" eventKey="2">
                          <span className="tabElement">
                            <i
                              className="fa fa-image"
                              style={{ width: "15px", margin: "10px" }}
                            />
                            Images
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="navLinkV" eventKey="1">
                          <span className="tabElement">
                            <i
                              className="fa fa-link"
                              style={{ width: "15px", margin: "10px" }}
                            />
                            Link
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="navLinkV" ventKey="3" disabled>
                          <span
                            className="tabElement"
                            style={{ cursor: "not-allowed" }}
                          >
                            <i
                              className="fa fa-poll"
                              style={{ width: "15px", margin: "10px" }}
                            />
                            Poll
                          </span>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Row>
                  <Row>
                    <Tab.Content>
                      <Tab.Pane eventKey="0">
                        {titleTag}
                        <input
                          type="text"
                          maxLength="180"
                          className="form-control"
                          placeholder="Text (optional)"
                          id="description"
                          name="description"
                          onChange={(e) => {
                            this.setState({ description: e.target.value });
                          }}
                        />
                        {postButton}
                      </Tab.Pane>
                      <Tab.Pane eventKey="2">
                        {titleTag}
                        <input
                          type="file"
                          className="form-control"
                          id="files"
                          name="files"
                          accept="image/*"
                          onChange={this.uploadImage}
                        ></input>
                        {postButton}
                        <Row>
                          <img src={this.state.postImageUrl} alt="" style={{ width: '60%', margin: 'auto', padding: '10%' }} />
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="1">
                        {titleTag}
                        <input
                          type="url"
                          className="form-control"
                          placeholder="Url"
                          id="link"
                          name="link"
                          required={this.state.type == "1"}
                          onChange={(e) => {
                            this.setState({ link: e.target.value });
                          }}
                        />
                        {postButton}
                      </Tab.Pane>
                    </Tab.Content>
                  </Row>
                </Row>
              </Tab.Container>
            </form>
          </Col>
          <Col sm={3}>
            {this.props.location &&
              this.props.location.rules &&
              this.props.location.rules.length > 0 && (
                <Row>
                  <Card className="card">
                    <Card.Header className="cardHeader">
                      <img alt="" height="40px" src={createPostRulesSVG} /> r/
                      {this.props.location?.communityName}&apos;s Rules
                    </Card.Header>
                    <Card.Body>
                      {this.props.location.rules.map((rule, index) => {
                        var normalView = [],
                          expandedView = [];

                        if (index < 5) {
                          normalView.push(
                            <div key={rule._id}>
                              <strong>{rule.title}</strong>: {rule.description}
                            </div>
                          );
                        } else {
                          if (index == 5) {
                            normalView.push(
                              <div
                                className="upArrowRotate"
                                style={{
                                  display: !this.state.showMoreRules
                                    ? "block"
                                    : "none",
                                  textAlign: "center",
                                }}
                                onClick={() =>
                                  this.setState((state) => ({
                                    showMoreRules: !state.showMoreRules,
                                  }))
                                }
                              >
                                <i className="fa fa-angle-double-down" />
                              </div>
                            );
                          }
                          expandedView.push(
                            <div key={rule._id}>
                              <strong>{rule.title}</strong>: {rule.description}
                            </div>
                          );
                        }
                        return (
                          <div key="">
                            {normalView}
                            <Collapse in={this.state.showMoreRules}>
                              <Fade>
                                <div>
                                  {expandedView}
                                  {this.props.location.rules.length - 1 ==
                                  index ? (
                                    <div
                                      className="downArrowRotate"
                                      style={{
                                        display: this.state.showMoreRules
                                          ? "block"
                                          : "none",
                                        textAlign: "center",
                                      }}
                                      onClick={() =>
                                        this.setState((state) => ({
                                          showMoreRules: !state.showMoreRules,
                                        }))
                                      }
                                    >
                                      <i className="fa fa-angle-double-up" />
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Fade>
                            </Collapse>
                          </div>
                        );
                      })}
                    </Card.Body>
                  </Card>
                </Row>
              )}

            <Row>
              <Card className="card">
                <Card.Header className="cardHeader">
                  <img alt="" height="40px" src={createPostRulesSVG} /> Posting
                  to Reddit
                </Card.Header>
                <Card.Body>
                  <ol>
                    <li>Remember the human</li>
                    <li>Behave like you would in real life</li>
                    <li>Look for the original source of content</li>
                    <li>Search for duplicates before posting</li>
                    <li>Read the community’s rules</li>
                  </ol>
                </Card.Body>
              </Card>
            </Row>
          </Col>
          <Col sm={1}></Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default CreatePost;
