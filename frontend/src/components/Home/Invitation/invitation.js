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
  getToken,
} from "../../../services/ControllerUtils";
import { getMongoUserID } from "../../../services/ControllerUtils";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import { TablePagination } from "@material-ui/core";

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
      searchForUser: true,
      page: 0,
      size: 2,
      count: 0,
      NoCommunities: false,
      NoInvitesSent: false,
      searchText: "",
    };
  }
  componentDidMount() {
    //user_id to be fetched from local Storage
    let data = {
      user_id: getMongoUserID(),
    };
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/getCommunitiesCreatedByMe", data)
      .then((response) => {
        this.props.unsetLoader();
        console.log(response);
        if (response.data.length > 0) {
          this.setState({ communities: response.data });
        } else {
          this.setState({ NoCommunities: true });
        }
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  }

  getCommunityInvitationStatus = (communityID, page, size) => {
    this.setState({ searchForUser: false });
    let data = {
      community_id: communityID,
      page: page,
      size: size,
    };
    console.log(data);
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/showInvitationStatus", data)
      .then((response) => {
        this.props.unsetLoader();
        if (response.data.sentInvitesTo.length > 0) {
          this.setState({
            invitedDetails: response.data.sentInvitesTo,
            listOfInvolvedUsers: response.data.listOfInvolvedUsers,
            count: response.data.totalRecords,
            selectedUsers: [], //to clear the suggestions and selected users
            searchedUser: [],
            NoInvitesSent: false,
          });
          console.log(this.state.NoInvitesSent);
        } else {
          console.log(this.state.selectedUsers);
          console.log(this.state.selectedUsers);
          console.log(this.state.count);
          this.setState({
            NoInvitesSent: true,
            listOfInvolvedUsers: [],
            invitedDetails: [],
            count: 0,
            selectedUsers: [], //to clear the suggestions and selected users
            searchedUser: [],
          });
        }
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };
  searchUser = (e) => {
    this.setState({ searchText: e.target.value });
    if (e.target.value.length > 1) {
      const data = {
        name: e.target.value,
        users: this.state.listOfInvolvedUsers,
        selectedUsers: this.state.selectedUsers,
      };
      console.log(data);
      this.props.setLoader();
      Axios.defaults.headers.common["authorization"] = getToken();
      Axios.post(backendServer + "/getSearchedUserForMongo", data)
        .then((response) => {
          this.props.unsetLoader();
          if (response.status == 200) {
            let results = [];
            let current_user = getMongoUserID();
            response.data.forEach((user) => {
              if (user._id != current_user) {
                results.push(user);
              }
            });
            this.setState({
              searchedUser: results,
            });
            console.log(this.state.searchedUser);
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
    if (this.state.searchText.length > 0) {
      let userToAddBackInSearchedUsers = {
        name: user.name,
        _id: user.user_id,
      };
      this.state.searchedUser.push(userToAddBackInSearchedUsers);
      this.setState({
        searchedUser: this.state.searchedUser,
      });
      console.log(this.state.searchedUser);
    }
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
    //remove the user from searchedUser array which is selected to send invite
    var filteredArray = this.state.searchedUser.filter((filterUser) => {
      return filterUser._id != user._id;
    });
    this.setState({
      searchedUser: filteredArray,
    });
  };
  sendInvites = (e) => {
    e.preventDefault();

    if (this.state.selectedUsers.length > 0) {
      let inviteData = {
        community_id: this.state.communityID,
        users: this.state.selectedUsers,
        invitedBy: getMongoUserID(),
      };
      console.log(inviteData);

      this.props.setLoader();
      Axios.defaults.headers.common["authorization"] = getToken();
      Axios.post(backendServer + "/sendInvite", inviteData)
        .then((response) => {
          this.props.unsetLoader();
          this.setState({
            selectedUsers: [],
            searchedUser: [],
          });
          console.log(response);
          this.getCommunityInvitationStatus(
            this.state.communityID,
            this.state.page,
            this.state.size
          );
        })
        .catch((error) => {
          this.props.unsetLoader();
          this.setState({
            selectedUsers: [],
            searchedUser: [],
          });
          console.log(error);
        });
    }
  };
  PageSizeChange = (e) => {
    this.setState({
      size: Number(e.target.value),
      page: 0,
    });
    this.getCommunityInvitationStatus(
      this.state.communityID,
      0,
      Number(e.target.value)
    );
  };

  PageChange = (e, page) => {
    this.setState({
      page: Number(page),
    });
    this.getCommunityInvitationStatus(
      this.state.communityID,
      Number(page),
      this.state.size
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
            <i className="fas fa-exclamation-triangle"></i>
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
              {/* {JSON.stringify(this.state.communityID)} */}
              <Row style={{ margin: "10px", padding: "25px 0", width: "45%" }}>
                <select
                  className="form-control"
                  name="community"
                  id="community"
                  onChange={(e) => {
                    document.getElementById("searchbox").value = "";
                    this.setState({ communityID: e.target.value });
                    if (e.target.value != "Select Community") {
                      this.getCommunityInvitationStatus(
                        e.target.value,
                        this.state.page,
                        this.state.size
                      );
                    } else {
                      this.setState({ invitedDetails: [] });
                    }
                  }}
                  value={this.state.communityID}
                >
                  <option selected>Select Community</option>
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
                  hidden={this.state.searchForUser}
                  style={{
                    display: "flex",
                    border: "1px solid #777",
                    padding: "0 10px",
                    borderRadius: "25px",
                  }}
                >
                  <input
                    hidden={this.state.searchForUser}
                    style={{
                      border: "0",
                      backgroundColor: "transparent",
                      height: "38px",
                    }}
                    type="text"
                    id="searchbox"
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
                    onClick={(e) => this.sendInvites(e)}
                  >
                    <i
                      hidden={this.state.searchForUser}
                      className="fa fa-paper-plane"
                    ></i>
                  </div>
                </div>
              </Card.Header>
              <Dropdown>{searchUsers}</Dropdown>
              <Paper component="ul" className="root">
                {selectedUsers}
              </Paper>
              <Card.Body>
                <Card.Text>
                  {this.state.NoInvitesSent ? "No Invites Sent" : ""}
                  {this.state.NoCommunities ? "No communites Created" : ""}
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
                <TablePagination
                  count={this.state.count}
                  page={this.state.page}
                  onChangePage={this.PageChange}
                  rowsPerPage={this.state.size}
                  onChangeRowsPerPage={this.PageSizeChange}
                  variant="outlined"
                  color="primary"
                  rowsPerPageOptions={[2, 5, 10]}
                />
              </Card.Body>
            </Card>
          </Container>
        </React.Fragment>
      </div>
    );
  }
}

export default invitation;
