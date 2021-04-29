import React, { Component } from "react";
import axios from "axios";
import { Dropdown, Col, Container, Row, Form, Button } from "react-bootstrap";
import backendServer from "../../../webConfig";
import "./mycommunity.css";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
// import { getTopicFromDB } from "../../../reduxOps/reduxActions/communityRedux";
// import { connect } from "react-redux";

class CreateCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityName: "",
      communityImages: [],
      listOfTopics: [],
      selectedTopic: [],
      communityDescription: ""
    };
  }

  OnImageUpload = e => {
    e.preventDefault();
    let data = new FormData();
    console.log(e.target.files[0]);
    data.append("file", e.target.files[0]);
    axios
      .post(`${backendServer}/upload`, data)
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log("error " + error));
  };

  AddCommunityDataToDB(communityData) {
    const data = {
      communityIDSQL: communityData.community_id,
      communityName: communityData.name,
      communityDescription: communityData.description,
      communityImages: this.state.communityImages,
      selectedTopic: this.state.selectedTopic
    };
    axios
      .post(`${backendServer}/addCommunity`, data)
      .then(response => {
        if (response.status == 200) {
          alert("Community created successfully");
        }
      })
      .catch(error => console.log("error " + error));
  }

  componentDidMount() {
    this.getTopicFromDB();
  }

  handleSubmit = e => {
    e.preventDefault();
    const data = {
      communityName: this.state.communityName,
      communityDescription: this.state.communityDescription
    };
    axios
      .post(`${backendServer}/createCommunity`, data)
      .then(response => {
        console.log(response.data);
        this.AddCommunityDataToDB(response.data);
      })
      .catch(error => console.log("error " + error));
  };

  async getTopicFromDB() {
    await axios
      .get(`${backendServer}/getTopic`)
      .then(response => {
        this.setState({
          listOfTopics: response.data
        });
        console.log(this.state.listOfTopics);
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }

  handleTopicSelection = topic => {
    this.setState(prevState => ({
      selectedTopic: [
        ...prevState.selectedTopic,
        {
          topic: topic.topic
        }
      ]
    }));
    console.log(this.state.selectedTopic);
  };

  handleDelete = (e, topic) => {
    console.log(topic);
    e.preventDefault();
    this.setState({
      listOfTopics: this.state.listOfTopics.filter(x => x !== topic.topic)
    });
  };

  render() {
    let dropDownItem = null;
    let selectedTopic = null;
    if (this.state.listOfTopics != null && this.state.listOfTopics.length > 0) {
      dropDownItem = this.state.listOfTopics.map(topic => {
        return (
          <Dropdown.Item
            key={topic.topic_id}
            onClick={() => this.handleTopicSelection(topic)}
          >
            {topic.topic}
          </Dropdown.Item>
        );
      });
      if (this.state.selectedTopic.length > 0) {
        selectedTopic = this.state.selectedTopic.map((topic, id) => {
          console.log(topic);
          return (
            <Chip
              key={id}
              label={topic.topic}
              onDelete={e => this.handleDelete(e, topic)}
              className="chip"
            />
          );
        });
      }
    }
    return (
      <React.Fragment>
        <Container fluid>
          <Row>
            <Col xs={1}>
              <img
                className="reddit-login"
                alt="Create Community"
                src="https://www.redditstatic.com/desktop2x/img/partner-connection.png"
              />
            </Col>
            <Col xs={4} style={{ padding: "50px", align: "center" }}>
              <Form onSubmit={this.handleSubmit} className="form-stacked">
                <Form.Label>Create a community</Form.Label>
                <hr style={{ borderTop: "0px" }} />
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
                  <Form.Text id="passwordHelpBlock" muted>
                    Community names including capitialization cannot be changed.
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="community-label" htmlFor="topics">
                    Topics<sup>*</sup>
                  </Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle>Select topic</Dropdown.Toggle>
                    <Dropdown.Menu>{dropDownItem}</Dropdown.Menu>
                  </Dropdown>
                  <Paper component="ul" className="root">
                    {selectedTopic}
                  </Paper>
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="description" className="community-label">
                    Description<sup>*</sup>
                  </Form.Label>
                  <Form.Control
                    data-testid="email-input-box"
                    type="textarea"
                    id="description"
                    name="description"
                    onChange={e =>
                      this.setState({ communityDescription: e.target.value })
                    }
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="uploadImage" className="community-label">
                    Upload Image
                  </Form.Label>
                  <Form.Control
                    className="form-control"
                    type="file"
                    id="image"
                    name="image"
                    multiple
                    onChange={this.OnImageUpload}
                  ></Form.Control>
                </Form.Group>
                <Form.Group className="text-center">
                  <Button
                    type="submit"
                    className="createCommunity"
                    onClick={this.handleSubmit}
                    color="btn btn-primary"
                  >
                    Create Community
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     listOfTopic: state.community.listOfTopic
//   };
// };
export default CreateCommunity;
// export default connect(mapStateToProps, {
//   getTopicFromDB
// })(CreateCommunity);
