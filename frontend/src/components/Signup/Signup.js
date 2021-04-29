import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { isEmail } from "validator";
import { connect } from "react-redux";
import { signupRedux } from "../../reduxOps/reduxActions/signupRedux";
import { Row, Col } from "react-bootstrap";
import "./../styles/loginStyle.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      error: {},
      loginError: "",
      auth: true,
    };
  }

  handleChange = (e) => {
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  submitForm = (e) => {
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
          loginError: "User is already registered",
        });
      } else {
        this.setState({
          authFlag: true,
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

    //TODO: need to implement based on JWT/User

    // if (typeof this.props.user != "undefined" && this.state.authFlag) {
    //   console.log("Control goes to home page from here");
    //   redirectVar = <Redirect to="/login" />;
    // } else redirectVar = <Redirect to="/signUp" />;
    return (
      <>
        <div className="container-fluid" style={{ padding: "0" }}>
          {redirectVar}
          <Row style={{ padding: "0", margin: "0" }}>
            <Col className="col-2" style={{ padding: "0", height: "648px" }}>
              <img
                className="reddit-login"
                alt="Reddit Background"
                src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
                style={{ height: "100%", width: "100%" }}
              />
            </Col>
            <Col className="login-form" style={{ paddingLeft: "30px" }}>
              <div
                id="errorLogin"
                hidden={this.state.loginError.length > 0 ? false : true}
                className="alert alert-danger"
                role="alert"
              >
                {this.state.loginError}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "500",
                  marginTop: "35px",
                }}
              >
                Sign up
              </div>
              <span style={{ fontSize: "12px" }}>
                By continuing, you agree to our User Agreement and Privacy
                Policy.
              </span>
              <div style={{ width: "45%", marginTop: "30px" }}>
                <div className="Sso__button Sso__googleIdButton">
                  Continue with Google
                </div>
                <div className="Sso__button Sso__appleIdContainer">
                  Continue with Apple
                </div>
                <div className="Sso__divider">
                  <span className="Sso__dividerLine"></span>
                  <span className="Sso__dividerText">or</span>
                  <span className="Sso__dividerLine"></span>
                </div>
              </div>
              <Form
                onSubmit={this.submitForm}
                className="signupForm"
                style={{ width: "45%" }}
              >
                <FormGroup>
                  <Label for="firstname">
                    Hi there! My <strong>Name</strong> is
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
                    <Button type="submit" color="btn btn-primary">
                      Sign me up!
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.user,
  };
};

export default connect(mapStateToProps, { signupRedux })(Signup);
