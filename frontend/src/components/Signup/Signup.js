import React, { Component } from "react";
import backendServer from "../../webConfig";
import axios from "axios";
import { connect } from "react-redux";
import { signupRedux } from "../../reduxOps/reduxActions/signupRedux";
import { Row, Col, Form, Button } from "react-bootstrap";
import "./../styles/loginStyle.css";
import { Redirect } from "react-router-dom";
import { SetLocalStorage } from "../../services/ControllerUtils";
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

  CreateUserProfile(user_id) {
    const data = {
      email: this.state.userInfo.email,
      name: this.state.userInfo.name,
      sqlUserID: user_id,
    };
    axios
      .post(`${backendServer}/createUserProfile`, data)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          const data = response.data;
          data.token = this.props.user.token;
          SetLocalStorage(data);
        }
      })
      .catch((error) => console.log("error " + error));
  }

  submitForm = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const { userInfo } = this.state;
    this.props.signupRedux(userInfo);
  };

  componentDidUpdate(prevState) {
    if (prevState.user != this.props.user) {
      if (this.props.user == "Registered") {
        this.setState({
          authFlag: false,
          formerror: {},
          loginError: "User is already registered",
        });
      } else {
        this.CreateUserProfile(this.props.user.userID);
        this.setState({
          authFlag: true,
        });
      }
    }
  }

  render() {
    let redirectVar = null;
    if (typeof this.props.user !== "undefined" && this.props.user.token) {
      redirectVar = <Redirect to="/home" />;
    } else {
      redirectVar = <Redirect to="/" />;
    }
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
                <Form.Group>
                  <Form.Label for="firstname">
                    Hi there! My <strong>Name</strong> is
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    placeholder="First Name"
                    onChange={this.handleChange}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="email">
                    Here&apos;s my <strong>email address</strong>
                  </Form.Label>
                  <Form.Control
                    data-testid="email-input-box"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Invalid email address"
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="password">
                    And here&apos;s my <strong>password</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Button type="submit" color="btn btn-primary">
                    Sign me up!
                  </Button>
                </Form.Group>
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
