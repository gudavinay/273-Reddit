import React, { Component } from "react";
import axios from "axios";
import {
  Dropdown,
  Col,
  Container,
  Row,
  Form,
  Button
  // ListGroup
} from "react-bootstrap";
import backendServer from "../../../webConfig";
import "./mycommunity.css";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { getMongoUserID } from "../../../services/ControllerUtils";

class CreateCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityName: props.location.pathname
        ? this.props.location.pathname.replace("/createCommunity/", "")
        : "",
      communityImages: [],
      uploadedImage: [],
      listOfTopics: [],
      selectedTopic: [],
      communityDescription: "",
      listOfRule: [],
      title: "",
      rulesDescription: "",
      addEditButton: "Add Rule",
      editRule: {}
    };
  }

  OnImageUpload = e => {
    e.preventDefault();
    let data = new FormData();
    this.state.communityImages.map(commImage => {
      data.append("file", commImage);
    });
    this.props.setLoader();
    axios
      .post(`${backendServer}/upload`, data)
      .then(response => {
        this.props.unsetLoader();
        const images = this.state.uploadedImage;
        console.log(response.data);
        response.data.map(data => {
          images.push({ url: data.Location });
        });
        this.setState({
          uploadedImage: images,
          communityImages: []
        });
        console.log(images);
      })
      .catch(error => {
        this.props.unsetLoader();
        console.log("error " + error);
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const ownerID = getMongoUserID();
    const data = {
      ownerID: ownerID,
      communityName: this.state.communityName,
      communityDescription: this.state.communityDescription,
      communityImages: this.state.uploadedImage,
      selectedTopic: this.state.selectedTopic,
      listOfRules: this.state.listOfRule
    };
    this.props.setLoader();
    axios
      .post(`${backendServer}/addCommunity`, data)
      .then(response => {
        this.props.unsetLoader();
        if (response.status == 200) {
          alert("Community created successfully");
        }
      })
      .catch(error => {
        this.props.unsetLoader();
        console.log("error " + error);
      });
  };

  componentDidMount() {
    this.getTopicFromDB();
  }

  async getTopicFromDB() {
    await axios
      .get(`${backendServer}/getTopic`)
      .then(response => {
        this.setState({
          listOfTopics: response.data
        });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }

  handleTopicSelection = topic => {
    const findTopic = this.state.selectedTopic.find(
      x => x.topic_id == topic.topic_id
    );
    if (typeof findTopic == "undefined") {
      this.setState(prevState => ({
        selectedTopic: [
          ...prevState.selectedTopic,
          {
            topic: topic.topic,
            topic_id: topic.topic_id
          }
        ]
      }));
    }

    console.log(this.state.selectedTopic);
  };
  handleAddRule = e => {
    e.preventDefault();
    if (Object.keys(this.state.editRule).length > 0) {
      let items = this.state.listOfRule;
      items.splice(items.indexOf(this.state.editRule), 1);
      this.setState({
        listOfRule: items
      });
    }
    this.setState(prevState => ({
      listOfRule: [
        ...prevState.listOfRule,
        {
          title: this.state.title,
          description: this.state.rulesDescription
        }
      ],
      rulesDescription: "",
      title: "",
      addEditButton: "Add Rule"
    }));
  };

  handleDelete = (e, topic) => {
    e.preventDefault();
    let items = this.state.selectedTopic;
    items.splice(items.indexOf(topic), 1);
    this.setState({
      selectedTopic: items
    });
  };

  handleRuleDelete = (e, rule) => {
    e.preventDefault();
    let items = this.state.listOfRule;
    items.splice(items.indexOf(rule), 1);
    this.setState({
      listOfRule: items
    });
  };

  handleEditRules = (e, rule) => {
    e.preventDefault();

    this.setState({
      editRule: rule,
      title: rule.title,
      rulesDescription: rule.description,
      addEditButton: "Update Rule"
    });
  };

  uploadMultipleFiles = e => {
    console.log(e.target.files);
    let communityImage = this.state.communityImages;
    Array.prototype.forEach.call(e.target.files, function (file) {
      communityImage.push(file);
    });
    this.setState({
      communityImages: communityImage
    });
  };

  render() {
    let dropDownItem = null;
    let selectedTopic = null;
    let rules = null;
    let imageUpload = null;
    if (this.state.uploadedImage.length > 0) {
      imageUpload = this.state.uploadedImage.map((image, idx) => {
        console.log(image.url);
        return (
          <img width={80} height={60} key={idx} src={image.url} alt="..." />
        );
      });
    }
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
        selectedTopic = this.state.selectedTopic.map(topic => {
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
                  onClick={e => this.handleEditRules(e, rule)}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button
                  className="btn"
                  onClick={e => this.handleRuleDelete(e, rule)}
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
                    value={this.state.communityName}
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
                  <Form.Control
                    className="form-control"
                    type="file"
                    id="image"
                    name="image"
                    multiple
                    onChange={this.uploadMultipleFiles}
                  ></Form.Control>
                  <Button type="btn" onClick={this.OnImageUpload}>
                    Upload
                  </Button>
                  <div className="form-group multi-preview">{imageUpload}</div>
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
                    onChange={e => this.setState({ title: e.target.value })}
                  />

                  <TextField
                    style={{ width: "300px", marginLeft: "5px" }}
                    className="rulesTextbox"
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    value={this.state.rulesDescription}
                    onChange={e =>
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
