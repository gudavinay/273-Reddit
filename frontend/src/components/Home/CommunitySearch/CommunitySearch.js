import React, { Component } from 'react';
import qs from "query-string";
import { connect } from 'react-redux';
import { updateSearchOptions } from "../../../reduxOps/reduxActions/searchRedux";

class CommunitySearch extends Component {
    constructor(props) {
        super(props);
    }
    processSearch = () => {
        const qR = qs.parse(this.props.location.search);
        this.props.updateSearchOptions({ query: qR.q })
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
        const {query, processing, results} = this.props.search;
        
        return (
            <React.Fragment>
                <h2>
                    {query || ""}
                </h2>
                <h6>
                    Search results
                </h6>
                {
                    processing ? (
                        <div style={{color: "red"}}>
                            Searching....
                        </div>
                    ) : (
                        results.communities && results.communities.length > 0 ? (
                            <div><pre>{JSON.stringify(results, null, 2) }</pre></div>
                        ) : (
                            <div>Sorry, there were no community results for “<b>{query}</b>”</div>
                        )
                    )
                }
                
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
        updateSearchOptions
    }
)(CommunitySearch);