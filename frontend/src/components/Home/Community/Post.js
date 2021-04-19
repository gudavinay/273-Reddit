import React, { Component } from 'react';
import Comment from './Comment'
class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            inside Post ... {this.props.content}
            <Comment content="new comment"/>
            </React.Fragment>
        );
    }
}


export default Post;