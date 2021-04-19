import React, { Component } from 'react';

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            inside Comment ... {this.props.content}
            </React.Fragment>
        );
    }
}


export default Comment;