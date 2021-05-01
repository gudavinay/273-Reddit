import React, { Component } from 'react';
// import Comment from './Comment';
import Post from './Post';
import backendServer from '../../../webConfig';
import Axios from 'axios';

class DetailedPostView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.setLoader();
        Axios.post(backendServer + '/getCommentsWithPostID', { post_id: this.props.data._id })
            .then(response => {
                this.props.unsetLoader();
                this.setState({ comments: response.data });
            }).catch(err => {
                this.props.unsetLoader();
                console.log(err);
            });
    }

    render() {
        var commentsToRender = [];
        // var parentChildCommentList = {};
        if (this.state.comments) {
            var parentCommentList = this.state.comments.filter(comment => comment.isParentComment);
            console.log("BEFORE", parentCommentList);

            parentCommentList.forEach(parentComment => {
                var child = this.state.comments.filter(comment => comment.parentCommentID == parentComment._id);
                console.log("CHILDREN", child);
                console.log("PARENT BEFORE ADDING", parentComment);
                parentComment.child = child;
                console.log("PARENT AFTER ADDING", parentComment);
            });
            console.log("AFTER", parentCommentList);

            parentCommentList.forEach(comment => {
                commentsToRender.push(<div>{comment.description}</div>)
                comment.child.forEach(chi => {
                    commentsToRender.push(<div>{"*" + chi.description}</div>)
                })
            });

            // this.state.comments.forEach(comment => {
            //     commentsToRender.push(<Comment data={comment} />)
            // });
        }
        return (
            <React.Fragment>
                <Post data={this.props} detailedView={true} />
                {commentsToRender}
            </React.Fragment>
        );
    }
}


export default DetailedPostView;