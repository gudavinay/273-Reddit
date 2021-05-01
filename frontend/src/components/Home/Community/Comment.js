import React, { Component } from 'react';

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div>  inside Comment ... {this.props.content} </div>

            </React.Fragment>
        );
    }
}


export default Comment;