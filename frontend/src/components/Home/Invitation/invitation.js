import React, { Component } from "react";
import { Container, Card, Row, Col, Dropdown } from "react-bootstrap";
import "./invitation.css";
// import { Input } from "reactstrap";
import Axios from "axios";
import backendServer from "../../../webConfig";
import inviteAcceptedSVG from "../../../assets/inviteAccepted.svg";
import inviteRejectedSVG from "../../../assets/inviteRejected.svg";
import {
  getDefaultRedditProfilePicture,
  getRelativeTime,
} from "../../../services/ControllerUtils";
import { getMongoUserID } from "../../../services/ControllerUtils";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";

export class invitation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      communities: [],
      communityID: "",
      invitedDetails: [],
      searchedUser: [],
      selectedUsers: [],
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
    };
  }
  componentDidMount() {
    //user_id to be fetched from local Storage
    let data = {
      user_id: getMongoUserID(),
    };
    this.props.setLoader();
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
    this.props.setLoader();
    Axios.post(backendServer + "/showInvitationStatus", data)
      .then((response) => {
        this.props.unsetLoader();
        this.setState({
          invitedDetails: response.data.sentInvitesTo,
          listOfInvolvedUsers: response.data.listOfInvolvedUsers,
        });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };
  searchUser = (e) => {
    if (e.target.value.length > 1) {
      const data = { name: e.target.value };
      this.props.setLoader();
      Axios.post(backendServer + "/getSearchedUserForMongo", data)
        .then((response) => {
          this.props.unsetLoader();
          if (response.status == 200) {
            this.setState({
              searchedUser: response.data,
            });
          }
        })
        .catch((error) => {
          this.props.unsetLoader();
          console.log(error);
        });
    } else if (e.target.value.length == 0) {
      this.setState({
        searchedUser: [],
      });
    }
  };
  handleDelete = (e, user) => {
    e.preventDefault();
    let items = this.state.selectedUsers;
    items.splice(items.indexOf(user), 1);
    this.setState({
      selectedUsers: items,
    });
  };
  handleUsersSelection = (user) => {
    this.setState(
      (prevState) => ({
        selectedUsers: [
          ...prevState.selectedUsers,
          {
            name: user.name,
            user_id: user._id,
          },
        ],
      }),
      () => {
        console.log(this.state.selectedUsers);
      }
    );
  };
  render() {
    let searchUsers = null;
    let selectedUsers = null;
    if (this.state.searchedUser.length > 0) {
      searchUsers = this.state.searchedUser.map((user) => {
        return (
          <Dropdown.Item
            key={user._id}
            onClick={() => this.handleUsersSelection(user)}
          >
            {user.name}
          </Dropdown.Item>
        );
      });
    }
    if (this.state.selectedUsers.length > 0) {
      selectedUsers = this.state.selectedUsers.map((user) => {
        return (
          <Chip
            key={user.user_id}
            label={user.name}
            onDelete={(e) => this.handleDelete(e, user)}
            className="chip"
          />
        );
      });
    }
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
                    onChange={this.searchUser}
                  />
                  <div
                    style={{
                      justifyContent: "center",
                      flexDirection: "column",
                      display: "flex",
                    }}
                  >
                    <i className="fa fa-paper-plane"></i>
                  </div>
                </div>
              </Card.Header>
              <Dropdown>{searchUsers}</Dropdown>
              <Paper component="ul" className="root">
                {selectedUsers}
              </Paper>
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
                              src={this.state.getDefaultRedditProfilePicture}
                            />
                          </Col>
                          <Col xs={5}>{details.userID.name}</Col>
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
