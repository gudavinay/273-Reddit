import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isEmail } from "validator";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback
} from "reactstrap";
import { connect } from "react-redux";
import { loginRedux } from "../../reduxOps/reduxActions/loginRedux";

class Login extends Component {
  constructor(props) {
    super(props);
    {
      this.state = {
        error: "",
        formerror: "",
        authFlag: ""
      };
    }
  }

  validateForm = () => {
    const userInfo = this.state;
    let error = {};

    if (!isEmail(userInfo.email)) error.email = "Please enter valid mail";
    if (userInfo.email === "") error.email = "Email should not be blank";
    if (userInfo.password === "")
      error.password = "Password should not be blank";
    return error;
  };

  emailEventHandler = e => {
    this.setState({
      email: e.target.value
    });
  };

  passEventHandler = e => {
    this.setState({
      password: e.target.value
    });
  };
  ///LoginUser'
  submitForm = e => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    const formerror = this.validateForm();
    if (Object.keys(formerror).length == 0) {
      this.props.userLogin(data);
      //set the with credentials to true
    } else {
      this.setState({ formerror });
    }
  };

  componentDidUpdate(prevState) {
    if (prevState.user != this.props.user) {
      if (this.props.user == "UnSuccessful Login") {
        this.setState({
          authFlag: false,
          formerror: {},
          error: this.props.user
        });
      } else {
        this.setState({
          authFlag: true,
          error: ""
        });
        this.SetLocalStorage(JSON.stringify(this.props.user));
      }
    }
  }

  SetLocalStorage(data) {
    if (typeof Storage !== "undefined") {
      localStorage.clear();
      localStorage.setItem("userData", data);
    }
  }

  render() {
    let redirectVar = null;
    //typeof this.props.user.token != "undefined" &&
    if (typeof this.props.user != "undefined" && this.state.authFlag) {
      console.log("Token is verified");
      redirectVar = <Redirect to="/home" />;
    } else redirectVar = <Redirect to="/login" />;
    return (
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
                hidden={this.state.error.length > 0 ? false : true}
                className="alert alert-danger"
                role="alert"
              >
                {this.state.error}
              </div>
              <h3>WELCOME TO Reddit</h3>
              <Form className="form-stacked">
                <FormGroup>
                  <Label htmlFor="email" className="Lable-align">
                    Email address
                  </Label>
                  <Input
                    data-testid="email-input-box"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.emailEventHandler}
                    invalid={this.state.formerror.email ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.formerror.email}</FormFeedback>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.passEventHandler}
                    invalid={this.state.formerror.password ? true : false}
                  ></Input>
                  <FormFeedback>{this.state.formerror.password}</FormFeedback>
                </FormGroup>
                <FormGroup row>
                  <Col>
                    <Button
                      data-testid="btn-submit"
                      type="submit"
                      className="btn btn-Normal"
                      onClick={this.submitForm}
                      color="btn btn-primary"
                    >
                      Login
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.login.user
  };
};

export default connect(mapStateToProps, { loginRedux })(Login);
