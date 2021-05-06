import axios from "axios";
import React, { Component } from "react";
// import { Row } from "react-bootstrap";
// import { Col } from "reactstrap";
import backendServer from "../../../../webConfig";

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: null,
      userDetails: null,
      removedList: [],
    };
  }

  removeFomCommunity = async () => {
    if (this.state.removedList && this.state.removedList.length > 0) {
      await axios
        .post(backendServer + "/removeUserFromCommunities", {
          userID: this.props.user_id,
          commList: this.state.removedList,
        })
        .then(() => {
          this.getCommunitiesForUser();
        });
    }
  };

  getCommunitiesForUser = async () => {
    await axios
      .get(`${backendServer}/getCommunitiesForUser?ID=${this.props.user_id}`)
      .then((result) => {
        this.setState({ communities: result.data });
      });
  };

  getUserDetails = async () => {
    await axios
      .get(`${backendServer}/getUserProfileByMongoID?ID=${this.props.user_id}`)
      .then((result) => {
        this.setState({ userDetails: result.data });
      });
  };

  componentDidMount = async () => {
    this.getCommunitiesForUser();
    this.getUserDetails();
  };

  render() {
    // console.log(this.props);
    let communitiesList = [];
    this.state.communities
      ? this.state.communities.forEach((item) => {
          communitiesList.push(
            <div className="row" key={item._id} style={{ margin: "30px" }}>
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
                    let arr = this.state.removedList;
                    if (arr.includes(item._id)) {
                      arr.pop(item._id);
                    } else {
                      arr.push(item._id);
                    }
                    this.setState({
                      removedList: arr,
                    });
                  }}
                />
              </div>
              <div className="col">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    paddingLeft: "15px",
                  }}
                >
                  r/{item.communityName}
                </div>
              </div>
            </div>
          );
        })
      : null;
    console.log(this.state);
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
            <div>
              u/
              {this.state.userDetails ? this.state.userDetails.name : ""}
            </div>
          </div>
          <div style={{ width: "60%", margin: "auto" }}>
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
              List of communities{" "}
              <strong>
                {this.state.userDetails ? this.state.userDetails.name : "user"}
              </strong>{" "}
              is part of
            </div>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "0",
                margin: "0 5px",
                maxHeight: "350px",
                height: "100%",
                minHeight: "350px",
                overflow: "scroll",
              }}
            >
              <div>
                {communitiesList.length > 0 ? (
                  communitiesList
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
              <button
                className="btn btn-dark"
                onClick={this.removeFomCommunity}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserModal;
