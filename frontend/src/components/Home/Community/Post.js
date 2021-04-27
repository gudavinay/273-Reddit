import React, { Component } from "react";
import Comment from "./Comment";
import { Card } from "react-bootstrap";
class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div>Post inside Post ... {this.props.content}</div>
        <Comment content="new comment" />
      </React.Fragment>
    );
  }
}

export default Post;
