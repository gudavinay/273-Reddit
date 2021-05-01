import React, { Component } from 'react';

class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div>{JSON.stringify(this.props.data)}</div>

            </React.Fragment>
        );
    }
}


export default Comment;