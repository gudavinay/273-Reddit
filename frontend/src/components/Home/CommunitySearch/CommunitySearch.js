import React, { Component } from "react";
import qs from "query-string";
import { connect } from "react-redux";
import { Row, Col, Form } from 'react-bootstrap';
import { updateCommunitySearchOptions } from "../../../reduxOps/reduxActions/communitySearchRedux";
import SearchResult from "./SearchResult";

class CommunitySearch extends Component {
  constructor(props) {
    super(props);
  }
  processSearch = () => {
    const qR = qs.parse(this.props.location.search);
    this.props.updateCommunitySearchOptions({ query: qR.q || "" });
  };
  getSnapshotBeforeUpdate(prevProps) {
    return {
      notifyRequired: prevProps.location.search !== this.props.location.search,
    };
  }
  componentDidMount() {
    this.processSearch();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.notifyRequired) {
      this.processSearch();
    }
    if (
      prevProps.communitySearch.processing !==
      this.props.communitySearch.processing
    ) {
      this.props.communitySearch.processing
        ? this.props.setLoader()
        : this.props.unsetLoader();
    }
  }

  render() {
    const { query, processing, results } = this.props.communitySearch;
    console.log({results})
    const { communities: { docs: communities } } = results || { communities: { docs: [] } };
    return (
      <React.Fragment>
        <Row
          style={{
            background: this.props.darkMode ? "black" : "#DAE0E6",
            maxWidth: "100%",
          }}
        >
          <Col sm={12}>
            {
              query === "" ?
                (
                  <div style={{ margin: "1rem" }}>
                    List of All Communities
                  </div>
                ) :
                (
                  <div style={{ margin: "1rem" }}>
                    Community search results for <b>&quot;{query}&quot;</b>
                  </div>
                )
            }
          </Col>
          <Col sm={12}>
            <div style={{ width: "95%", margin: "0 auto", background: "#fff", height: "50px", borderRadius: "5px" }}>
              <div style={{ float: "left" }}>
                <Form.Group style={{ margin: "5px", display: "inline-flex" }}>
                  <label style={{ whiteSpace: "nowrap", marginTop: "5px", color: "#7d72728a" }}>Sort By</label>
                  <Form.Control as="select" onChange={e => {
                    this.setState({ sortKey: e.target.value }, () => {
                      // this.handledata();
                    })
                  }} style={{ fontSize: "14px", marginLeft: "5px", fontWeight: "600" }}>
                    <option value="createdAt">Created At</option>
                    <option value="users">Most No of Users</option>
                    <option value="posts">Most No of Posts</option>
                    <option value="upvoted">Most Upvoted</option>
                  </Form.Control>
                  <Form.Control as="select" onChange={e => {
                    this.setState({ sortValue: e.target.value }, () => {
                      // this.handledata();
                    })
                  }} style={{ fontSize: "14px", marginLeft: "5px", fontWeight: "600" }}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div style={{ float: "right" }}>
                <Form.Group style={{ margin: "5px", display: "inline-flex" }}>
                  <label style={{ whiteSpace: "nowrap", marginTop: "5px", color: "#7d72728a" }}>Per Page</label>
                  <Form.Control as="select" onChange={e => {
                    this.setState({ perPage: e.target.value }, () => {
                      // this.handledata();
                    })
                  }} style={{ fontSize: "14px", marginLeft: "5px", fontWeight: "600" }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </Form.Control>
                </Form.Group>
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div style={{ margin: "1rem", padding: "1rem" }}>
              {!processing &&
                (communities && communities.length > 0 ? (
                  // <div><pre>{JSON.stringify(results, null, 2)}</pre></div>
                  communities.map((c) => {
                    return <SearchResult key={c._id} data={c} />;
                  })
                ) : (
                  <div>
                    Sorry, there were no community results for “<b>{query}</b>”
                  </div>
                ))}
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
      communitySearch: state.communitySearch,
    };
  },
  {
    updateCommunitySearchOptions,
  }
)(CommunitySearch);
