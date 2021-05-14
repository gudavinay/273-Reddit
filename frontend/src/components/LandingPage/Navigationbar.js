import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Container, Navbar, Form } from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import redditLogoDark from "../../assets/header_logo1.svg";
import redditLogoLight from "../../assets/Reddit_logo_full_1SVG.svg";
import LinearProgress from "@material-ui/core/LinearProgress";
import { BsFillCaretDownFill } from "react-icons/bs";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { BiBell } from "react-icons/bi";
import "./navigationbar.css";
// import userProfileSVG from "../../assets/default_avatar.svg";
import Axios from "axios";
import backendServer from "../../webConfig";
import Notification from "../Home/Notification/Notification";
import { Link, Redirect } from "react-router-dom";
import { logoutRedux } from "../../reduxOps/reduxActions/loginRedux";
import {
  getDefaultRedditProfilePicture,
  getToken,
  getUserProfile,
  getMongoUserID,
} from "../../services/ControllerUtils";

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    const qR = new URLSearchParams(props.location.search);
    this.state = {
      search: qR.get("q") || "",
      leftDropdown: "Home",
      showNotificationModal: false,
      notificationData: [],
      getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
    };
  }
  onSubmitSearch = (e) => {
    e.preventDefault();
    if (this.state.search.trim() === "") return;
    this.processSearchSubmitActivity();
  };
  onChangeSearchText = (e) => this.setState({ search: e.target.value });
  processSearchSubmitActivity = () => {
    const { pathname } = this.props.location;
    if (pathname === "/communitysearch") {
      this.props.history.push({
        pathname: "/communitysearch",
        search: "?" + new URLSearchParams({ q: this.state.search }).toString(),
      });
    } else if (pathname === "/home") {
      // Write logic for posts search
      this.props.history.push({
        pathname: "/home",
        search: "?" + new URLSearchParams({ q: this.state.search }).toString(),
      });
      console.log(this.state.search);
    }
  };
  hideModal = () => {
    this.setState({
      showNotificationModal: false,
    });
  };
  showModal = () => {
    this.setState({
      showNotificationModal: true,
    });
    this.getNotificationData();
  };
  async componentDidMount() {
    // const userId = getMongoUserID();
    // Axios.defaults.headers.common["authorization"] = getToken();
    // Axios.get(`${backendServer}/getVote?userId=${userId}`)
    //   .then((result) => {
    //     localStorage.setItem("userVote", JSON.stringify(result.data));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.getNotificationData();
  }
  // checkIfUserIsModerator = () => {
  //   let user_id = getMongoUserID();
  //   console.log("calling checkIfUser is moderator");
  //   Axios.defaults.headers.common["authorization"] = getToken();
  //   Axios.get(backendServer + "/checkUserIsModerator/" + user_id)
  //     .then((result) => {
  //       console.log(result);
  //       this.props.unsetLoader();
  //       if (result.data.length > 0) {
  //         console.log("true");
  //         this.setState({
  //           NotshowInvitation: false,
  //         });
  //       } else {
  //         console.log("false");
  //         this.setState({
  //           NotshowInvitation: true,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       this.props.unsetLoader();
  //       console.log(err);
  //     });
  // };
  getNotificationData = async () => {
    let data = {
      user_id: getMongoUserID(),
    };
    this.props.setLoader();
    Axios.defaults.headers.common["authorization"] = getToken();
    Axios.post(backendServer + "/getNotificationData", data)
      .then((result) => {
        this.props.unsetLoader();
        this.setState({ notificationData: result.data });
      })
      .catch((err) => {
        this.props.unsetLoader();
        console.log(err);
      });
  };

  RemoveDataFromLocalStorage() {
    if (typeof Storage !== "undefined") {
      if (localStorage.key("userData")) {
        localStorage.clear();
      }
    }
  }

  onSignout = () => {
    document.getElementById("expandRightDropDown").classList.add("hidden");
    this.RemoveDataFromLocalStorage();
    this.props.logoutRedux();
  };
  render() {
    let redirectVar = null;
    if (getToken() == null) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <React.Fragment>
        {redirectVar}
        {this.props.loading && (
          <LinearProgress
            color="secondary"
            style={{
              backgroundColor: this.props.darkMode ? "#363537" : "white",
              transition: "all 0.5s ease",
            }}
          />
        )}
        <Container
          style={{
            boxShadow: "0px 0px 5px #777",
            // marginBottom: "30px",
            maxWidth: "100%",
          }}
        >
          <Navbar
            style={{
              padding: "0",
              position: "relative",
            }}
          >
            <Row style={{ display: "contents" }}>
              <Col sm={1} style={{ padding: "0" }}>
                <Navbar.Brand style={{ padding: "10px 0", margin: "0" }}>
                  <Link to="/home">
                    <img
                      style={{ width: "100%", height: "30px" }}
                      alt="Reddit Logo"
                      src={
                        this.props.darkMode ? redditLogoDark : redditLogoLight
                      }
                    />
                  </Link>
                </Navbar.Brand>
              </Col>
              <Col sm={2} style={{ paddingRight: "0", position: "relative" }}>
                <div
                  className="leftDropdownDiv"
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "-17px",
                    padding: "5.5px 0",
                    width: "225px",
                    borderRadius: "5px",
                    backgroundColor: this.props.darkMode ? "#363537" : "#fff",
                    zIndex: "2",
                    border: "1px solid #777",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "500",
                      padding: "0 15px",
                    }}
                    onClick={() => {
                      let classListLeft =
                        document.getElementById("expandLeftDropDown").classList;
                      let classListRight = document.getElementById(
                        "expandRightDropDown"
                      ).classList;
                      if (classListLeft.contains("hidden")) {
                        classListLeft.remove("hidden");
                      } else {
                        classListLeft.add("hidden");
                      }
                      if (!classListRight.contains("hidden")) {
                        classListRight.add("hidden");
                      }
                    }}
                  >
                    {this.state.leftDropdown}
                    <div>
                      <BsFillCaretDownFill />
                    </div>
                  </div>
                  <div
                    className="expandLeftDropDownC hidden"
                    id="expandLeftDropDown"
                  >
                    <hr style={{ margin: "12.5px 0" }} />
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({
                          leftDropdown: "community Analytics",
                        });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/communityanalytics");
                      }}
                    >
                      Community Analytics
                    </div>
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({
                          leftDropdown: "Community Moderation",
                        });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/mycommunitiesmoderation");
                      }}
                    >
                      Community Moderation
                    </div>
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({ leftDropdown: "Create New Community" });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/createCommunity/");
                      }}
                    >
                      Create New Community
                    </div>
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({ leftDropdown: "Community Search" });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push({
                          pathname: "/communitysearch",
                          search:
                            "?" +
                            new URLSearchParams({
                              q: this.state.search,
                            }).toString(),
                        });
                      }}
                    >
                      Community Search
                    </div>

                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({ leftDropdown: "Home", search: "" });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/home");
                      }}
                    >
                      Home
                    </div>

                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({ leftDropdown: "My Communities" });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/mycommunities");
                      }}
                    >
                      My Communities
                    </div>

                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        this.setState({ leftDropdown: "Send Invitation" });
                        document
                          .getElementById("expandLeftDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/invitation");
                      }}
                    >
                      Send Invitation
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={5}>
                <Form onSubmit={this.onSubmitSearch}>
                  <Form.Group controlId="search" style={{ margin: "0" }}>
                    <Form.Control
                      value={this.state.search}
                      onChange={this.onChangeSearchText}
                      type="text"
                      placeholder="Search"
                      style={{
                        backgroundColor: this.props.darkMode
                          ? "#363537"
                          : "white",
                        borderColor: "#777",
                      }}
                    />
                  </Form.Group>
                </Form>
                {
                  <Notification
                    hideNav={this.hideModal}
                    notificationData={this.state.notificationData}
                    showNav={this.state.showNotificationModal}
                    getNotificationData={this.getNotificationData}
                    {...this.props}
                  />
                }
              </Col>
              <Col
                sm={2}
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <IoChatboxEllipsesOutline
                  style={{ fontSize: "24px", cursor: "pointer" }}
                  onClick={() => {
                    this.props.history.push("/messages");
                  }}
                />
                <BiBell
                  style={{ fontSize: "24px", cursor: "pointer" }}
                  onClick={this.showModal}
                />
              </Col>
              <Col sm={2} style={{ position: "relative" }}>
                <div
                  className="rightDropdownDiv"
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "-17px",
                    padding: "5.5px 0",
                    width: "217px",
                    borderRadius: "5px",
                    backgroundColor: this.props.darkMode ? "#363537" : "#fff",
                    zIndex: "2",
                    border: "1px solid #777",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "500",
                      padding: "0 15px",
                    }}
                    onClick={() => {
                      let classListLeft =
                        document.getElementById("expandLeftDropDown").classList;
                      let classListRight = document.getElementById(
                        "expandRightDropDown"
                      ).classList;
                      if (classListRight.contains("hidden")) {
                        classListRight.remove("hidden");
                      } else {
                        classListRight.add("hidden");
                      }
                      if (!classListLeft.contains("hidden")) {
                        classListLeft.add("hidden");
                      }
                    }}
                  >
                    <div>
                      <img
                        src={
                          getUserProfile() &&
                          getUserProfile().profile_picture_url
                            ? getUserProfile().profile_picture_url
                            : this.state.getDefaultRedditProfilePicture
                        }
                        style={{
                          width: "25px",
                          borderRadius: "3px",
                          marginRight: "10px",
                        }}
                      />
                      {getUserProfile() != null
                        ? getUserProfile().name
                        : "User Name"}
                    </div>
                    <div>
                      <BsFillCaretDownFill />
                    </div>
                  </div>
                  <div
                    className="expandRightDropDownC hidden"
                    id="expandRightDropDown"
                  >
                    <hr style={{ margin: "11px 0" }} />
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={() => {
                        document
                          .getElementById("expandRightDropDown")
                          .classList.add("hidden");
                        this.props.history.push("/userprofile");
                      }}
                    >
                      Your Account
                    </div>
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                    >
                      <div
                        style={{ display: "inline-block", marginRight: "15px" }}
                      >
                        DarkMode
                      </div>
                      <Switch
                        checked={this.props.darkMode}
                        onChange={() => {
                          this.props.themeToggler();
                        }}
                        color="default"
                        name="checkedB"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </div>
                    <div
                      className={
                        this.props.darkMode
                          ? "NavLinks backGround_dark"
                          : "NavLinks backGround_light"
                      }
                      onClick={this.onSignout}
                    >
                      Sign Out
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Navbar>
        </Container>
      </React.Fragment>
    );
  }
}

export default connect(
  (state) => {
    return state;
  },
  { logoutRedux }
)(Navigationbar);
