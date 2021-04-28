import React, { Component } from 'react';
import qs from "query-string";
import { connect } from 'react-redux';
import { updateCommunitySearchOptions } from "../../../reduxOps/reduxActions/communitySearchRedux";

class CommunitySearch extends Component {
    constructor(props) {
        super(props);
    }
    processSearch = () => {
        const qR = qs.parse(this.props.location.search);
        this.props.updateCommunitySearchOptions({ query: qR.q })
    }
    getSnapshotBeforeUpdate(prevProps) {
        return { notifyRequired: prevProps.location.search !== this.props.location.search };
    }
    componentDidMount() {
        this.processSearch();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot.notifyRequired) {
            this.processSearch();
        }
    }

    render() {
        return (
            <React.Fragment>
                inside CommunitySearch For {this.props.search.query || "Nothing"}...
            </React.Fragment>
        );
    }
}


export default connect(
    (state) => {
        return {
            search: state.search
        };
    },
    {
        updateCommunitySearchOptions
    }
)(CommunitySearch);