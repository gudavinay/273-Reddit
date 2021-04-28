import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import axios from "axios";
import config from "../../config";
import { Dropdown, Col, Container, Row } from "react-bootstrap";
import backendServer from "../../../webConfig";
// import { getTopicFromDB } from "../../../reduxOps/reduxActions/communityRedux";
// import { connect } from "react-redux";

class CreateCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
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
      .post(`${config.serverAddress}/upload`, data)
      .then(response => {
        console.log(response);
        this.setState({
          groupPhoto: response.data
        });
      })
      .catch(error => console.log("error " + error));
  };

  componentDidMount() {
    this.getTopicFromDB();
  }

  AddCommunityDetail() {}

  handleSubmit = e => {};

  async getTopicFromDB() {
    const storageToken = JSON.parse(localStorage.getItem("userData"));
    axios.defaults.headers.common["authorization"] = storageToken.token;
    await axios
      .get(`${backendServer}/community/getTopic`)
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
          topic: topic
        }
      ]
    }));
  };

  render() {
    let dropDownItem = null;
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
    }
    return (
      <React.Fragment>
        <Navigationbar />
        <Container fluid>
          <Row>
            <Col xs={2}>
              <img
                className="reddit-login"
                alt="Reddit Background"
                src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
              />
            </Col>
            <Col xs={6}>
              <Form onSubmit={this.handleSubmit} className="form-stacked">
                <FormGroup>
                  <Label className="community-label" for="name">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    onChange={e => this.setState({ name: e.target.value })}
                    required
                  ></Input>
                  <Label className="information" for="name">
                    Community names including capitialization cannot be changed.
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label className="community-label" htmlFor="topics">
                    Topics
                  </Label>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      Select topic
                    </Dropdown.Toggle>

                    <Dropdown.Menu>{dropDownItem}</Dropdown.Menu>
                  </Dropdown>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description">Community Description</Label>
                  <Input
                    data-testid="email-input-box"
                    type="textarea"
                    id="description"
                    name="description"
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                    required
                  ></Input>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="uploadImage">Upload Image</Label>
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    multiple
                    onChange={this.OnImageUpload}
                    invalid={this.state.error.password ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.error.password}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Button
                    type="submit"
                    onClick={this.handleSubmit}
                    color="btn btn-primary"
                  >
                    Create Community
                  </Button>
                </FormGroup>
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
