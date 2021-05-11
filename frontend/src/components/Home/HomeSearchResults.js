import React, { Component } from "react";
// import Post from "./Community/Post";

export class HomeSearchResults extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("component");
  }

  render() {
    return <React.Fragment>{this.props.data}</React.Fragment>;
  }
}

export default HomeSearchResults;
