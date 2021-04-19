import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
import { isEmail } from "validator";
import { connect } from "react-redux";
import { signupRedux } from "../../reduxOps/reduxActions/signupRedux";

class Signup extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        userInfo: {},
        error: {},
        loginError: "",
        auth: true
      };
    }
  }

  handleChange = e => {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  submitForm = e => {
    //prevent page from refresh
    e.preventDefault();

    const { userInfo } = this.state;
    const error = this.validateForm();
    if (Object.keys(error).length == 0) {
      this.props.signupRedux(userInfo);
    } else {
      this.setState({ error });
    }
  };

  componentDidUpdate(prevState) {
    if (prevState.user != this.props.user) {
      console.log(this.props.user);
      if (this.props.user == "Registered") {
        this.setState({
          authFlag: false,
          formerror: {},
          loginError: "User is already registered"
        });
      } else {
        this.setState({
          authFlag: true
        });
        this.SetLocalStorage(JSON.stringify(this.props.user));
      }
    }
  }

  SetLocalStorage(userInfo) {
    if (typeof Storage !== "undefined") {
      console.log("Set local storage here");
      localStorage.clear();
      try {
        localStorage.setItem("userData", userInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }

  validateForm = () => {
    const { userInfo } = this.state;
    let error = {};
    if (userInfo.name === "") error.name = "First Name should not be blank";
    if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
    return error;
  };

  render() {
    let redirectVar = null;
    if (typeof this.props.user != "undefined" && this.state.authFlag) {
      console.log("Control goes to home page from here");
      redirectVar = <Redirect to="/login" />;
    } else redirectVar = <Redirect to="/signUp" />;
    return (
      <>
        <div className="container-fluid form-cont">
          {redirectVar}
          <div className="flex-container">
            <div className="row">
              <div className="col col-sm-6">
                <img src="./assets/splitwiselogo-01.png" alt="..."></img>
              </div>
              <div className="col col-sm-6">
                <div
                  id="errorLogin"
                  hidden={this.state.loginError.length > 0 ? false : true}
                  className="alert alert-danger"
                  role="alert"
                >
                  {this.state.loginError}
                </div>
                <h3>Introduce Yourself</h3>
                <Form onSubmit={this.handleSubmit} className="form-stacked">
                  <FormGroup>
                    <Label for="firstname" style={{ fontSize: "24px" }}>
                      Hi there!My name is
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="First Name"
                      invalid={this.state.error.name ? true : false}
                      onChange={this.handleChange}
                    ></Input>
                    <FormFeedback>{this.state.error.name}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="email">
                      Here&apos;s my <strong>email address</strong>
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
                    <Label htmlFor="password">
                      And here&apos;s my <strong>password</strong>
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={this.handleChange}
                      invalid={this.state.error.password ? true : false}
                    ></Input>
                    <FormFeedback>{this.state.error.password}</FormFeedback>
                  </FormGroup>
                  <FormGroup row>
                    <Col>
                      <Button
                        type="submit"
                        onClick={this.submitForm}
                        color="btn btn-Normal"
                      >
                        Sign me up!
                      </Button>
                    </Col>
                  </FormGroup>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};

export default connect(mapStateToProps, { signupRedux })(Signup);
