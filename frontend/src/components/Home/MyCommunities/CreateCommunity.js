import React, { Component } from "react";
import axios from "axios";
import {
  Dropdown,
  Col,
  Container,
  Row,
  Form,
  Button,
  // ListGroup
} from "react-bootstrap";
import backendServer from "../../../webConfig";
import "./mycommunity.css";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

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
      communityDescription: "",
      listOfRule: [],
      title: "",
      rulesDescription: "",
      addEditButton: "Add Rule",
      editRule: {},
    };
  }

  OnImageUpload = (e) => {
    e.preventDefault();
    let data = new FormData();
    console.log(e.target.files[0]);
    data.append("file", e.target.files[0]);
    this.props.setLoader();
    axios.post(`${backendServer}/upload`, data)
      .then((response) => {
        this.props.unsetLoader();
        console.log(response);
      })
      .catch((error) => {
        this.props.unsetLoader();
        console.log("error " + error);
      });
  };

  AddCommunityDataToDB(communityData) {
    const data = {
      communityIDSQL: communityData.community_id,
      communityName: communityData.name,
      communityDescription: communityData.description,
      communityImages: this.state.communityImages,
      selectedTopic: this.state.selectedTopic,
      listOfRules: this.state.listOfRule,
    };
    this.props.setLoader();
    axios.post(`${backendServer}/addCommunity`, data)
      .then((response) => {
        this.props.unsetLoader();
        if (response.status == 200) {
          alert("Community created successfully");
        }
      })
      .catch((error) => {
        this.props.unsetLoader();
        console.log("error " + error);
      });
  }

  componentDidMount() {
    this.getTopicFromDB();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      communityName: this.state.communityName,
      communityDescription: this.state.communityDescription,
    };
    axios
      .post(`${backendServer}/createCommunity`, data)
      .then((response) => {
        console.log(response.data);
        this.AddCommunityDataToDB(response.data);
      })
      .catch((error) => console.log("error " + error));
  };

  async getTopicFromDB() {
    await axios
      .get(`${backendServer}/getTopic`)
      .then((response) => {
        this.setState({
          listOfTopics: response.data,
        });
        console.log(this.state.listOfTopics);
      })
      .catch((error) => {
        this.setState({
          error: error,
        });
      });
  }

  handleTopicSelection = (topic) => {
    this.setState((prevState) => ({
      selectedTopic: [
        ...prevState.selectedTopic,
        {
          topic: topic.topic,
          topic_id: topic.topic_id,
        },
      ],
    }));
    console.log(this.state.selectedTopic);
  };
  handleAddRule = (e) => {
    e.preventDefault();
    if (Object.keys(this.state.editRule).length > 0) {
      let items = this.state.listOfRule;
      items.splice(items.indexOf(this.state.editRule), 1);
      this.setState({
        listOfRule: items,
      });
    }
    this.setState((prevState) => ({
      listOfRule: [
        ...prevState.listOfRule,
        {
          title: this.state.title,
          description: this.state.rulesDescription,
        },
      ],
      rulesDescription: "",
      title: "",
      addEditButton: "Add Rule",
    }));
  };

  handleDelete = (e, topic) => {
    e.preventDefault();
    let items = this.state.selectedTopic;
    items.splice(items.indexOf(topic), 1);
    this.setState({
      selectedTopic: items,
    });
  };

  handleRuleDelete = (e, rule) => {
    e.preventDefault();
    let items = this.state.listOfRule;
    items.splice(items.indexOf(rule), 1);
    this.setState({
      listOfRule: items,
    });
  };

  handleEditRules = (e, rule) => {
    e.preventDefault();

    this.setState({
      editRule: rule,
      title: rule.title,
      rulesDescription: rule.description,
      addEditButton: "Update Rule",
    });
  };

  render() {
    let dropDownItem = null;
    let selectedTopic = null;
    let rules = null;
    if (this.state.listOfTopics != null && this.state.listOfTopics.length > 0) {
      dropDownItem = this.state.listOfTopics.map((topic) => {
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
        selectedTopic = this.state.selectedTopic.map((topic) => {
          return (
            <Chip
              key={topic.topic_id}
              label={topic.topic}
              onDelete={(e) => this.handleDelete(e, topic)}
              className="chip"
            />
          );
        });
      }

      if (this.state.listOfRule.length > 0) {
        rules = this.state.listOfRule.map((rule, idx) => {
          return (
            <Row key={idx}>
              <Col xs={2}>
                <strong>{rule.title}</strong>
              </Col>
              <Col xs={7}>{rule.description}</Col>
              <Col xs={3}>
                <button
                  className="btn"
                  onClick={(e) => this.handleEditRules(e, rule)}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button
                  className="btn"
                  onClick={(e) => this.handleRuleDelete(e, rule)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </Col>
            </Row>
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
            <Col
              xs={5}
              style={{ padding: "50px", borderRight: "1px solid #ddd" }}
            >
              <Form onSubmit={this.handleSubmit} className="form-stacked">
                <Form.Label>
                  <b>Create a community</b>
                </Form.Label>
                <Form.Group>
                  <Form.Label className="community-label" htmlFor="name">
                    Name<sup>*</sup>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) =>
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
                    onChange={(e) =>
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
            <Col xs={5} className="rulesForm">
              <Form.Group>
                <Form.Label
                  className="community-label"
                  htmlFor="Rules"
                  style={{ fontWeight: "bold" }}
                >
                  Rules
                </Form.Label>
                <br />
                <form noValidate autoComplete="off">
                  <TextField
                    className="rulesTextbox"
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    value={this.state.title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                  />

                  <TextField
                    style={{ width: "300px", marginLeft: "5px" }}
                    className="rulesTextbox"
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    value={this.state.rulesDescription}
                    onChange={(e) =>
                      this.setState({ rulesDescription: e.target.value })
                    }
                  />
                </form>
                <Button
                  style={{ marginTop: "10px" }}
                  className="createCommunity"
                  onClick={this.handleAddRule}
                  color="btn btn-primary"
                >
                  {this.state.addEditButton}
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <strong>List of Rules</strong>
                </Form.Label>
                {rules}
              </Form.Group>
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
