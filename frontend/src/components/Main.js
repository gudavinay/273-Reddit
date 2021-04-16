import React, { Component } from "react";
import { Route } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      val: "",
    };
  }
  render() {
    return (
      <React.Fragment>
          <Route exact path="/" component={LandingPage} />
      </React.Fragment>
    );
  }
}
export default Main;
