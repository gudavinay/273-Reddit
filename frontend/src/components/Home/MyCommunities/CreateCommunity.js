import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import Navigationbar from "../../LandingPage/Navigationbar";
import axios from "axios";
import config from "../../config";

class CreateCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      communityInfo: {},
      communityImages: []
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

  getTopicFromDB() {}

  render() {
    return (
      <React.Fragment>
        <Navigationbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col col-sm-1">
              <img
                className="reddit-login"
                alt="Reddit Background"
                src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
              />
            </div>
            <div className="col col-sm-6">
              <Form onSubmit={this.handleSubmit} className="form-stacked">
                <FormGroup>
                  <Label className="community-label" for="name">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    invalid={this.state.error.name ? true : false}
                    onChange={this.handleChange}
                  ></Input>
                  <Label className="information" for="name">
                    Community names including capitialization cannot be changed.
                  </Label>
                  <FormFeedback>{this.state.error.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label className="community-label" htmlFor="topics">
                    Topics
                  </Label>
                  <Input
                    data-testid="email-input-box"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    invalid={this.state.error.email ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.error.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="description">Community Description</Label>
                  <Input
                    data-testid="email-input-box"
                    type="textarea"
                    id="description"
                    name="description"
                    onChange={this.handleChange}
                    invalid={this.state.error.email ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.error.email}</FormFeedback>
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
                    onClick={this.submitForm}
                    color="btn btn-primary"
                  >
                    Sign me up!
                  </Button>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateCommunity;
