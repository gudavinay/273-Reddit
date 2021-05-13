import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import React, { Component } from "react";
import { Col, Container, Row, Dropdown } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import backendServer from "../../../webConfig";
import {
  getDefaultRedditProfilePicture,
  getMongoUserID,
  getToken
} from "../../../services/ControllerUtils";
import "./UserProfile.css";
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfTopics: [],
      saveSuccess: false,
      saveFailed: false,
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
      radios: [
        { name: "Male", value: "Male" },
        { name: "Female", value: "Female" },
        { name: "Other", value: "Other" }
      ],
      checked: false,
      listOfTopicsFromDB: []
    };
  }

  componentDidMount() {
    this.props.setLoader();
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(`${backendServer}/getUserProfileByMongoID?ID=${getMongoUserID()}`)
      .then(result => {
        this.props.unsetLoader();
        this.setState({ ...result.data });
      })
      .catch(err => {
        this.props.unsetLoader();
        console.log(err);
      });

    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(`${backendServer}/getTopic`)
      .then(result => {
        this.props.unsetLoader();
        console.log(result);
        this.setState({ listOfTopicsFromDB: result.data });
      })
      .catch(err => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  uploadImage = e => {
    if (e.target.files)
      this.setState({
        file: e.target.files[0],
        fileText: e.target.files[0].name
      });
  };

  handleDelete = (e, topic) => {
    e.preventDefault();
    let items = this.state.listOfTopics;
    items.splice(items.indexOf(topic), 1);
    this.setState({
      listOfTopics: items
    });
  };

  handleTopicSelection = topic => {
    const findTopic = this.state.listOfTopics.find(
      x => x.topic_id == topic.topic_id
    );
    if (typeof findTopic == "undefined") {
      this.setState(prevState => ({
        listOfTopics: [
          ...prevState.listOfTopics,
          {
            topic: topic.topic,
            topic_id: topic.topic_id
          }
        ]
      }));
    }

    console.log(this.state.listOfTopics);
  };

  onSubmit = async event => {
    event.preventDefault();
    const data = {
      name: this.state.name,
      email: this.state.email,
      location: this.state.location,
      profile_picture_url: this.state.profile_picture_url,
      gender: this.state.gender,
      listOfTopics: this.state.listOfTopics,
      bio: this.state.bio,
      id: getMongoUserID(),
      token: getToken()
    };

    console.log(this.state, data);
    axios.post(`${backendServer}/updateUserProfile`, data).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    })
  };

  componentDidUpdate(prevState) {
    if (prevState.userProfile !== this.props.userProfile) {
      this.setState({ saveSuccess: true, saveFailed: false });
    }
  }

  render() {
    let dropDownItem = null;
    let listOfTopics = null;
    if (
      this.state.listOfTopicsFromDB != null &&
      this.state.listOfTopicsFromDB.length > 0
    ) {
      dropDownItem = this.state.listOfTopicsFromDB.map(topic => {
        return (
          <Dropdown.Item
            key={topic.topic_id}
            onClick={() => this.handleTopicSelection(topic)}
          >
            {topic.topic}
          </Dropdown.Item>
        );
      });
    }
    if (this.state.listOfTopics.length > 0) {
      listOfTopics = this.state.listOfTopics.map(topic => {
        return (
          <Chip
            key={topic.topic_id}
            label={topic.topic}
            onDelete={e => this.handleDelete(e, topic)}
            className="chip"
          />
        );
      });
    }
    return (
      <React.Fragment>
        {/* {JSON.stringify(this.state)} */}
        <Container>
          <form name="profileForm" id="profileForm" onSubmit={this.onSubmit}>
            <Row style={{ paddingTop: "3%" }}>
              <Col sm={3}>
                <center>
                  <h2 style={{ marginBottom: "45px" }}>Your account</h2>
                  <div className="DPParent" style={{ position: "relative" }}>
                    <img
                      src={
                        this.state.profile_picture_url
                          ? this.state.profile_picture_url
                          : this.state.getDefaultRedditProfilePicture
                      }
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "500px",
                        boxShadow: "5px 10px 25px 1px #777"
                      }}
                      alt="profilephoto"
                    />
                    <div
                      className="buttonOnDP"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        top: "0"
                      }}
                    >
                      <i
                        className="fa fa-camera"
                        style={{ opacity: 1, fontSize: "75px", color: "white" }}
                        onClick={() => { }}
                      >
                        <input
                          style={{
                            width: "100%",
                            height: "100%",
                            opacity: "0.0001",
                            position: "absolute",
                            top: "0"
                          }}
                          className="form-control"
                          type="file"
                          name="profilepicture"
                          accept="image/*"
                          onChange={this.uploadImage}
                        />
                      </i>
                    </div>
                  </div>
                  <button className="form-control" disabled={!this.state.file} style={{ margin: '30px 0 0 0', width: '100px' }} onClick={() => {
                    let data = new FormData();
                    data.append("file", this.state.file);
                    this.props.setLoader();
                    axios
                      .post(`${backendServer}/upload`, data)
                      .then(response => {
                        this.props.unsetLoader();
                        console.log(response);
                        if (response.data && response.data[0] && response.data[0].Location)
                          this.setState({ profile_picture_url: response.data[0].Location })
                      })
                      .catch(error => {
                        this.props.unsetLoader();
                        console.log("error " + error);
                      });
                  }}>Upload</button>
                  <Row style={{ marginTop: "10px" }}>
                    <Col sm={9}></Col>
                  </Row>
                </center>
              </Col>
              <Col style={{ margin: "5rem" }}>
                <Row>Your name</Row>
                <Row>
                  <input
                    type="text"
                    className="form-control"
                    onChange={e => this.setState({ name: e.target.value })}
                    name="name"
                    id="name"
                    title="Please enter valid name"
                    value={this.state.name}
                    required
                  />
                </Row>
                <Row>Your email address</Row>
                <Row>
                  <input
                    type="email"
                    className="form-control"
                    onChange={e => this.setState({ email: e.target.value })}
                    name="email"
                    title="Please enter valid email"
                    pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$"
                    value={this.state.email}
                    required
                  />
                </Row>
                <Row>
                  <span>
                    Location{" "}
                    <span style={{ fontSize: "12px" }}>(City/State)</span>
                  </span>
                </Row>
                <Row>
                  <input
                    type="tel"
                    className="form-control"
                    onChange={e => this.setState({ location: e.target.value })}
                    name="location"
                    title="Please enter valid location"
                    value={this.state.location}
                  />
                </Row>
                <Row>Password</Row>
                <Row>
                  <input
                    type="password"
                    className="form-control"
                    onChange={e =>
                      this.setState({ password: e.target.value })
                    }
                    name="password"
                    id="password"
                    title="Please enter valid password"
                    value={this.state.password}
                  />
                </Row>
              </Col>
              <Col style={{ marginTop: "5rem" }}>
                <Row>Your gender</Row>
                <Row>
                  <ButtonGroup toggle>
                    {this.state.radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        type="radio"
                        variant={"light"}
                        name="radio"
                        value={radio.value}
                        checked={this.state.gender === radio.value}
                        onChange={e =>
                          this.setState({ gender: e.currentTarget.value })
                        }
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Row>
                <Row>
                  <Dropdown style={{ marginTop: '25px', marginBottom: '20px' }}>
                    <Dropdown.Toggle>Select topic</Dropdown.Toggle>
                    <Dropdown.Menu>{dropDownItem}</Dropdown.Menu>
                  </Dropdown>
                  <Paper component="ul" className="root">
                    {listOfTopics}
                  </Paper>
                </Row>
                <Row style={{ marginTop: '10px' }}>Bio</Row>
                <Row>
                  <textarea
                    type="text"
                    className="form-control"
                    onChange={e =>
                      this.setState({ bio: e.target.value })
                    }
                    name="bio"
                    id="bio"
                    title="Please enter valid bio"
                    value={this.state.bio}
                  />
                </Row>
              </Col>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  className="submitbutton"
                  style={{
                    fontFamily: "Noto Sans, Arial, sans-serif", fontSize: "14px", fontWeight: "700", letterSpacing: "unset", lineHeight: "17px", textTransform: "unset", minHeight: "32px", minWidth: "20px", padding: "4px 16px", backgroundColor: "royalblue", borderRadius: "30px",
                  }}
                >
                  Save
                </Button>
                <br />
                {this.state.saveSuccess && (
                  <Alert
                    style={{
                      width: "15rem",
                      margin: "auto",
                      marginTop: "1rem"
                    }}
                    variant="success"
                  >
                    User Profile Updated.
                  </Alert>
                )}
                {this.state.saveFailed && (
                  <Alert
                    style={{
                      width: "15rem",
                      margin: "auto",
                      marginTop: "1rem"
                    }}
                    variant="danger"
                  >
                    Error Occured.
                  </Alert>
                )}
              </div>
            </Row>
          </form>
        </Container>
      </React.Fragment>
    );
  }
}

export default UserProfile;
