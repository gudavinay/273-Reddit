import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { getRelativeTime, nFormatter } from "../../../services/ControllerUtils";
import DefaultCardText from "../../../assets/communityIcons/card-text.svg";
import backendServer from "../../../webConfig";

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: false,
            communities: []
        };
    }
    componentDidMount() {
        this.loadUserData();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.loadUserData();
        }
    }
    loadUserData = async () => {
        try {
            const { pathname } = this.props.location;
            const user_id = pathname.split("/");

            this.props.setLoader();
            const { data: { user, user_communities } } = await axios.get(
                backendServer + "/getUserProfile/" + (this.props.match.params.user_id || user_id[user_id.length - 1])
            );
            this.props.unsetLoader();
            this.setState({
                user,
                communities: user_communities
            })
        } catch (e) { console.log(e); }
    }
    vote = async ({ community_id, voting }) => {
        try {
            await axios.post(`${backendServer}/addVote`, {
                "userId": this.props.login?.user?.userID || "6089d660e18b492c2a4e5b19", // for temp purpose until login completes
                "entityId": community_id,
                "voteDir": voting
            });
            const { data: { upvoteCount, downvoteCount, entityId } } = await axios.get(`${backendServer}/getVote?entityId=${community_id}`);

            const { communities } = this.state;

            let temp = communities.reduce((acc, it) => {
                acc[it._id] = it;
                return acc;
            }, {});

            temp[entityId].upVotedLength = upvoteCount;
            temp[entityId].downVotedLength = downvoteCount;

            this.setState({
                communities: Object.values(temp)
            });
        } catch (e) { console.log(e) }
    }
    render() {
        const { user, communities } = this.state;
        return (
            <React.Fragment>
                <div className="container">
                    <Row>
                        <p>
                            <Row>
                                <Col xs={8}>
                                    <div style={{ margin: "0rem", padding: "0.7rem 0rem" }}>
                                        {(communities && communities.length > 0 && (
                                            communities.map((c) => {
                                                return (
                                                    <div key={c._id}>
                                                        <UserCommunity key={c._id} data={c} vote={this.vote} />
                                                    </div>
                                                );
                                            })
                                        ))}
                                    </div>
                                </Col>
                                <Col>
                                    <Row>
                                        <Card>
                                            <Card.Header style={{ borderBottom: "0px" }}>
                                                <div>
                                                    <div style={{
                                                        backgroundColor: "#33a8ff",
                                                        borderRadius: "4px 4px 0 0",
                                                        height: "94px",
                                                        left: "0",
                                                        position: "absolute",
                                                        top: "0",
                                                        width: "100%"
                                                    }}></div>
                                                    <div style={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: "6px",
                                                        boxSizing: "border-box",
                                                        height: "86px",
                                                        marginLeft: "-3px",
                                                        marginTop: "16px",
                                                        padding: "3px",
                                                        position: "relative",
                                                        width: "86px",
                                                        backgroundImage: `url(${user?.profile_picture_url || "https://www.redditstatic.com/avatars/avatar_default_07_7193FF.png"})`,
                                                        backgroundSize: "cover",
                                                        border: "5px solid #f7f7f7"
                                                    }}>
                                                    </div>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col xs={6}>
                                                        <h6>Name</h6>
                                                        <p>{user?.name}</p>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <h6>Location</h6>
                                                        <p>{user?.location || "N/A"}</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <h6>Bio</h6>
                                                        <p>{user?.bio || "N/A"}</p>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                            {/* <Card.Footer>

                                            </Card.Footer> */}
                                        </Card>
                                    </Row>
                                </Col>
                            </Row>
                        </p>
                    </Row>
                </div>
            </React.Fragment >
        );
    }
}

class UserCommunity extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data } = this.props;
        const { _id: community_id,
            imageURL,
            communityName,
            communityDescription,
            listOfUsersLength,
            upVotedLength,
            downVotedLength,
            postsLength,
            createdAt,
            createdBy
        } = data || {};
        return (
            <React.Fragment>
                <Card style={{ margin: "0px" }}>
                    <Card.Body style={{ padding: "1px" }}>
                        <Row>
                            <Col xs={1} style={{ background: "#eef3f7", maxWidth: "5.8%", marginLeft: "14px" }}>
                                <div>
                                    <i style={{ cursor: "pointer" }} className="icon icon-arrow-up"
                                        onClick={() => { this.props.vote({ community_id, voting: "1" }) }}
                                    ></i>

                                    <span style={{ whiteSpace: "nowrap" }}>{nFormatter(upVotedLength - downVotedLength, 1)}</span>

                                    <i style={{ cursor: "pointer" }} className="icon icon-arrow-down"
                                        onClick={() => { this.props.vote({ community_id, voting: "-1" }) }}
                                    ></i>
                                </div>
                            </Col>
                            <Col xs={2} style={{ paddingLeft: "1px", maxWidth: "12%" }}>
                                {
                                    imageURL.length > 0 && imageURL[0].url ? (
                                        <img alt="Community" role="presentation" src={imageURL[0].url} style={{
                                            backgroundPosition: "50%", backgroundRepeat: "no-repeat", backgroundSize: "100%", boxSizing: "border-box", flex: "none", fontSize: "32px", lineHeight: "32px", margin: "0 8px", width: "65px", verticalAlign: "middle"
                                        }} />
                                    ) : (
                                        <div style={{ background: "#eef3f7", height: "80%", borderRadius: "5px" }}>
                                            <img src={DefaultCardText} style={{ width: "25px", margin: "23px" }} />
                                        </div>
                                    )
                                }
                            </Col>
                            <Col style={{ paddingLeft: "0px" }}>
                                <Row style={{ paddingLeft: "0px" }}>
                                    <h3 style={{ paddingLeft: "5px", fontSize: "16px", paddingTop: "8px", margin: "0px" }}>
                                        <Link to={"/community/".concat(community_id)}>
                                            {communityName}
                                        </Link>
                                    </h3>
                                    <h4 style={{ fontSize: "12px", padding: "8px", width: "95%" }}>
                                        {communityDescription.substr(0, 350)}
                                    </h4>
                                </Row>
                                <Row style={{ paddingLeft: "0px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", color: "#878a8c", fill: "#878a8c", fontSize: "12px" }}>
                                        <div style={{ marginLeft: "0px" }}>
                                            <i className="fa fa-users"></i>
                                            <span style={{ marginLeft: "4px" }}> {nFormatter((listOfUsersLength), 1)} Members</span>
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <i className="fa fa-sticky-note-o"></i>
                                            <span style={{ marginLeft: "4px" }}> {nFormatter((postsLength), 1)} Posts</span>
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <i className="icon icon-user"></i>
                                            <span style={{ marginLeft: "4px" }}> Created By <Link to={"/user/".concat(createdBy.user_id)}>{createdBy?.name}</Link> {getRelativeTime(createdAt)}</span>
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

export default User;
