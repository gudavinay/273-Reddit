import React, { Component } from "react";
import { Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./LoginSignup/LoginComponent";
import Signup from "./LoginSignup/SignupComponent";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: ""
    };
  }
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/signUp" component={Signup} />
      </React.Fragment>
    );
  }
}
export default Main;
