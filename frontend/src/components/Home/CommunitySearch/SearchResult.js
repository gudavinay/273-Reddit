import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { getRelativeTime, nFormatter } from "../../../services/ControllerUtils";
import DefaultCardText from "../../../assets/communityIcons/card-text.svg";

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data } = this.props;
        const { communityName, communityDescription, listOfUsers, upvotedBy, downvotedBy, posts, createdAt, createdBy } = data || {}; // imageURL,
        return (
            <React.Fragment>
                <Card style={{ margin: "0px" }}>
                    <Card.Body style={{ padding: "1px" }}>
                        <Row>
                            <Col xs={1} style={{ background: "#eef3f7", maxWidth: "3.7%", marginLeft: "14px" }}>
                                <div>
                                    <i style={{ cursor: "pointer" }} className="icon icon-arrow-up"></i>
                                    <span>{upvotedBy.length - downvotedBy.length}</span>
                                    <i style={{ cursor: "pointer" }} className="icon icon-arrow-down"></i>
                                </div>
                            </Col>
                            <Col xs={1} style={{ paddingLeft: "1px" }}>
                                <div style={{ background: "#eef3f7", height: "80%", borderRadius: "5px" }}>
                                    <img src={DefaultCardText} style={{ width: "25px", margin: "23px" }} />
                                </div>
                            </Col>
                            <Col style={{ paddingLeft: "0px" }}>
                                <Row style={{ paddingLeft: "0px" }}>
                                    <h3 style={{ paddingLeft: "5px", fontSize: "16px", paddingTop: "8px", margin: "0px" }}>
                                        {communityName}
                                    </h3>
                                    <h4 style={{ fontSize: "12px", padding: "8px", width: "95%" }}>
                                        {communityDescription.substr(0,350)}
                                    </h4>
                                </Row>
                                <Row style={{ paddingLeft: "0px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", color: "#878a8c", fill: "#878a8c", fontSize: "12px" }}>
                                        <div style={{ marginLeft: "0px" }}>
                                            <i className="fa fa-users"></i>
                                            <span style={{marginLeft: "4px"}}> {nFormatter((listOfUsers.length), 1)} Members</span>
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <i className="fa fa-sticky-note-o"></i>
                                            <span style={{marginLeft: "4px"}}> {nFormatter((posts.length), 1)} Posts</span>
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <i className="icon icon-user"></i>
                                            <span style={{marginLeft: "4px"}}> Created By <Link to={"/user/".concat(createdBy.user_id)}>{createdBy?.name}</Link> {getRelativeTime(createdAt)}</span>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default SearchResult;
