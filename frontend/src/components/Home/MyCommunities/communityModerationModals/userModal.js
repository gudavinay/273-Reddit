import axios from "axios";
import React, { Component } from "react";
import {
  getMongoUserID,
  getToken,
  getDefaultRedditProfilePicture,
} from "../../../../services/ControllerUtils";
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
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
    };
  }

  removeFomCommunity = async () => {
    if (this.state.removedList && this.state.removedList.length > 0) {
      axios.defaults.headers.common["authorization"] = getToken();
      await axios
        .post(backendServer + "/removeUserFromCommunities", {
          userID: this.props.user_id,
          commList: this.state.removedList,
        })
        .then(() => {
          this.getCommunitiesForUserPartOfOwnerCommunity();
        });
    }
  };

  getCommunitiesForUserPartOfOwnerCommunity = async () => {
    const ownerID = getMongoUserID();
    axios.defaults.headers.common["authorization"] = getToken();
    await axios
      .get(
        `${backendServer}/getCommunitiesForUserPartOfOwnerCommunity?userID=${this.props.user_id}&ownerID=${ownerID}`
      )
      .then((result) => {
        this.setState({ communities: result.data });
      });
  };

  getUserDetails = async () => {
    axios.defaults.headers.common["authorization"] = getToken();
    await axios
      .get(`${backendServer}/getUserProfileByMongoID?ID=${this.props.user_id}`)
      .then((result) => {
        this.setState({ userDetails: result.data });
      });
  };

  componentDidMount = async () => {
    this.getCommunitiesForUserPartOfOwnerCommunity();
    this.getUserDetails();
  };

  render() {
    console.log(this.state);
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
              marginBottom: "25px",
              display: "flex",
            }}
          >
            <div
              style={{
                display: "block",
                width: "40px",
                height: "40px",
                // backgroundColor: "#ccc",
                borderRadius: "25px",
                border: "1px solid #777",
                margin: "0 15px",
                overflow: "hidden",
              }}
            >
              <img
                src={this.state.userDetails && this.state.userDetails.profile_picture_url ? this.state.userDetails.profile_picture_url : this.state.getDefaultRedditProfilePicture}
                alt=""
                style={{
                  height: "40px",
                  width: "40px",
                }}
              />
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
            <div style={{ padding: "20px 0 0 0", textAlign: "center" }}>
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
