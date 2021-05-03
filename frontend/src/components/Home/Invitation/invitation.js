import React, { Component } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import "./invitation.css";
// import { Input } from "reactstrap";
import Axios from "axios";
import backendServer from "../../../webConfig";
import inviteAcceptedSVG from "../../../assets/inviteAccepted.svg";
import inviteRejectedSVG from "../../../assets/inviteRejected.svg";
import { getRelativeTime } from "../../../services/ControllerUtils";

export class invitation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      communities: [],
      communityID: "",
      invitedDetails: [],
    };
  }
  componentDidMount() {
    //user_id to be fetched from local Storage
    let data = {
      user_id: "6089d63ea112c02c1df2914c",
    };
    Axios.post(backendServer + "/getCommunitiesCreatedByMe", data)
      .then((response) => {
        this.props.unsetLoader();
        console.log(response);
        this.setState({ communities: response.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  getCommunityInvitationStatus = (communityID) => {
    let data = {
      community_id: communityID,
    };
    Axios.post(backendServer + "/showInvitationStatus", data)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({ invitedDetails: response.data }, () => {
          console.log(this.state.invitedDetails);
        });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };
  render() {
    const checkStatus = (value) => {
      if (value == 1) {
        return (
          <span>
            <img src={inviteAcceptedSVG} alt="" />
          </span>
        );
      } else if (value == 0) {
        return (
          <span>
            <img src="" alt="Pending SVG Needed" />
          </span>
        );
      } else if (value == -1) {
        return (
          <span>
            <img src={inviteRejectedSVG} alt="" />
          </span>
        );
      }
    };
    return (
      <div>
        <React.Fragment>
          <Container style={{ padding: "0 15%" }}>
            <div>
              <Row style={{ margin: "10px" }}>
                <select
                  className="form-control"
                  name="community"
                  id="community"
                  onChange={(e) => {
                    this.setState({ communityID: e.target.value });
                    this.getCommunityInvitationStatus(e.target.value);
                  }}
                  value={this.state.communityID}
                >
                  <option>Select Community</option>
                  {this.state.communities.map((community, index) => (
                    <option key={index} value={community.communityID}>
                      {community.communityName}
                    </option>
                  ))}
                </select>
              </Row>
            </div>

            <Card>
              <Card.Header
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  Approved Users
                </div>
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #777",
                    padding: "0 10px",
                    borderRadius: "25px",
                  }}
                >
                  <input
                    style={{
                      border: "0",
                      backgroundColor: "transparent",
                      height: "38px",
                    }}
                    type="text"
                    placeholder="Search User"
                    className="searchbar"
                  />
                  <div
                    style={{
                      justifyContent: "center",
                      flexDirection: "column",
                      display: "flex",
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <Card.Text>
                  {this.state.invitedDetails &&
                    this.state.invitedDetails.map((details, index) => (
                      <div key={index}>
                        <Row>
                          <Col xs={1}>
                            <img
                              alt=""
                              width="40px"
                              style={{ borderRadius: "20px", margin: "5px" }}
                              src="https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
                            />
                          </Col>
                          <Col xs={5}>{details.userID._id}</Col>
                          <Col xs={2}>{checkStatus(details.isAccepted)}</Col>
                          <Col xs={4}>{getRelativeTime(details.dateTime)}</Col>
                        </Row>
                      </div>
                    ))}
                </Card.Text>
              </Card.Body>
            </Card>
          </Container>
        </React.Fragment>
      </div>
    );
  }
}

export default invitation;
