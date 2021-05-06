import axios from "axios";
import React, { Component } from "react";
import { Row } from "react-bootstrap";
import { Col } from "reactstrap";
import backendServer from "../../../../webConfig";

class CommunityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityDetails: null,
      users: null,
      acceptedList: [],
    };
  }

  acceptedUsers = async () => {
    if (this.state.acceptedList && this.state.acceptedList.length > 0) {
      await axios
        .post(backendServer + "/acceptUsersToCommunity", {
          communityID: this.props.comm_id,
          userList: this.state.acceptedList,
        })
        .then(() => {
          this.fetchUsers();
        });
    }
  };

  fetchUsers = async () => {
    // this.props.setLoader();
    await axios
      .get(`${backendServer}/getCommunityDetails?ID=${this.props.comm_id}`)
      .then(async (response) => {
        //   this.props.unsetLoader();
        this.setState({ communityDetails: response.data });
        let userList = [];
        response.data.listOfUsers.forEach((item) => {
          userList.push(item.userID);
        });
        console.log(userList);
        if (userList.length > 0) {
          await axios
            .post(backendServer + "/RequestedUsersForCom", {
              usersList: userList,
            })
            .then((res) => {
              console.log(res.data);
              this.setState({ users: res.data });
            })
            .catch((err) => {
              // this.props.unsetLoader();
              console.log(err);
            });
        }
      })
      .catch((err) => {
        //   this.props.unsetLoader();
        console.log(err);
      });
  };

  componentDidMount = async () => {
    this.fetchUsers();
  };

  render() {
    console.log(this.props);
    console.log(this.state);
    let requestedUsers = [];
    let acceptedUsers = [];
    let counter = 1;
    this.state.communityDetails
      ? this.state.communityDetails.listOfUsers.forEach((item) => {
          if (!item.isAccepted) {
            let data = this.state.users ? this.state.users[item.userID] : {};
            requestedUsers.push(
              <div
                key={item.userID}
                className="row"
                style={{ padding: "15px 30px" }}
              >
                <div
                  className="col-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={() => {
                      let arr = this.state.acceptedList;
                      if (arr.includes(item.userID)) {
                        arr.pop(item.userID);
                      } else {
                        arr.push(item.userID);
                      }
                      this.setState({
                        acceptedList: arr,
                      });
                    }}
                  />
                </div>
                <div
                  className="col"
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      display: "block",
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#ccc",
                      borderRadius: "5px",
                      border: "1px solid #777",
                      margin: "0 15px",
                    }}
                  >
                    .
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    u/{data.name}
                  </div>
                </div>
              </div>
            );
          } else {
            let data = this.state.users ? this.state.users[item.userID] : {};
            acceptedUsers.push(
              <div
                key={item.userID}
                className="row"
                style={{ padding: "15px" }}
              >
                <div
                  className="col-1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {counter}.
                </div>
                <div
                  className="col"
                  style={{
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      display: "block",
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#ccc",
                      borderRadius: "5px",
                      border: "1px solid #777",
                      margin: "0 15px",
                    }}
                  >
                    .
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    u/{data.name}
                  </div>
                </div>
              </div>
            );
            counter++;
          }
        })
      : [];
    return (
      <>
        <div
          className="container"
          style={{ padding: "50px", minHeight: "80vh", maxHeight: "80vh" }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "24px",
              marginBottom: "50px",
            }}
          >
            r/
            {this.state.communityDetails
              ? this.state.communityDetails.communityName
              : ""}
          </div>
          <Row style={{ paddingLeft: "0px" }}>
            <Col>
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#eee",
                  padding: "10px 0",
                  border: "1px solid #ddd",
                  margin: "0 5px",
                  borderRadius: "5px",
                }}
              >
                User requests for joining the community
              </div>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "0",
                  margin: "0 5px",
                  maxHeight: "350px",
                  height: "100%",
                  overflow: "scroll",
                }}
              >
                <div>
                  {requestedUsers.length > 0 ? (
                    requestedUsers
                  ) : (
                    <div
                      style={{
                        color: "#777",
                        textAlign: "center",
                        fontSize: "14px",
                        marginTop: "160px",
                      }}
                    >
                      --- no data to display ---
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "30px 0 0 0", textAlign: "center" }}>
                <button className="btn btn-dark" onClick={this.acceptedUsers}>
                  Accept
                </button>
              </div>
            </Col>
            <Col>
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#eee",
                  padding: "10px 0",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  margin: "0 5px",
                }}
              >
                Users already part of the community
              </div>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "0",
                  margin: "0 5px",
                  maxHeight: "350px",
                  height: "100%",
                  overflow: "scroll",
                }}
              >
                <div>
                  {acceptedUsers.length > 0 ? (
                    acceptedUsers
                  ) : (
                    <div
                      style={{
                        color: "#777",
                        textAlign: "center",
                        fontSize: "14px",
                        marginTop: "160px",
                      }}
                    >
                      --- no data to display ---
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default CommunityModal;
