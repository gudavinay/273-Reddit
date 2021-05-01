import React, { Component } from 'react';
import Comment from './Comment';
import Post from './Post';
import backendServer from '../../../webConfig';
import Axios from 'axios';

class DetailedPostView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setLoader();
        Axios.post(backendServer + '/getCommentsWithPostID', { postID: this.props.data._id })
            .then(response => {
                this.props.unsetLoader();
                this.setState({ comments: response.data });
            }).catch(err => {
                this.props.unsetLoader();
                console.log(err);
            });
    }

    render() {
        return (
            <React.Fragment>
                <Post data={this.props} detailedView={true} />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
            </React.Fragment>
        );
    }
}


export default DetailedPostView;