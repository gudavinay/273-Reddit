import React, { Component } from 'react';
import qs from "query-string";
import { connect } from 'react-redux';
import { Col, Row } from "react-bootstrap";
import { updateCommunitySearchOptions } from "../../../reduxOps/reduxActions/communitySearchRedux";
import SearchResult from "./SearchResult";

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
        if (prevProps.communitySearch.processing !== this.props.communitySearch.processing) {
            this.props.communitySearch.processing ? this.props.setLoader() : this.props.unsetLoader();
        }
    }

    render() {
        const { query, processing, results } = this.props.communitySearch;
        return (
            <React.Fragment>
                <Row style={{ background: this.props.darkMode ? "black" : "#DAE0E6", maxWidth: "100%" }}>
                    <Col sm={12}>
                        <div style={{ margin: "1rem" }}>
                            Community search results for <b>&quot;{query}&quot;</b>
                        </div>
                    </Col>
                    <Col sm={12}>
                        <div style={{ margin: "1rem", padding: "1rem" }}>
                            {
                                !processing && (
                                    results.communities && results.communities.length > 0 ? (
                                        // <div><pre>{JSON.stringify(results, null, 2)}</pre></div>
                                        results.communities.map(c => {
                                            return (
                                                <SearchResult key={c._id} data={c} />
                                            )
                                        })
                                    ) : (
                                        <div>Sorry, there were no community results for “<b>{query}</b>”</div>
                                    )
                                )
                            }
                        </div>
                    </Col>
                </Row>

            </React.Fragment>
        );
    }
}


export default connect(
    (state) => {
        return {
            communitySearch: state.communitySearch
        };
    },
    {
        updateCommunitySearchOptions
    }
)(CommunitySearch);