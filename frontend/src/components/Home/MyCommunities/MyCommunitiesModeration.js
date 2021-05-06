import React, { Component } from "react";
import axios from "axios";
import backendServer from "../../../webConfig";
import { Col, Modal, Row } from "react-bootstrap";
import { BiSearchAlt } from "react-icons/bi";
import "./myCommunityModeration.css";
import { getMongoUserID } from "../../../services/ControllerUtils";
import CommunityModal from "./communityModerationModals/communityModal";
import "./../../styles/landingPageStyle.css";
import { FiX } from "react-icons/fi";
class MyCommunitiesModeration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityPagination: {
        page: 1,
        size: 2,
        total_pages: 0,
        total_count: 0,
        search: "",
      },
      userPagination: {
        page: 1,
        size: 2,
        total_pages: 0,
        total_count: 0,
        search: "",
      },
      communities: [],
      usersFromCommunities: [],
      showCommunityModal: false,
      showUserModal: false,
      selectedCommunity: null,
      selectedUser: null,
    };
  }

  getCommunitiesCreatedByUser = async () => {
    const ownerID = getMongoUserID(); //TO DO: Take it from JWT TOKEN AFTER LOGIN
    await axios
      .get(
        `${backendServer}/getCommunitiesForOwner?ID=${ownerID}&size=${
          this.state.communityPagination.size
        }&page=${this.state.communityPagination.page - 1}&search=${
          this.state.communityPagination.search
        }`
      )
      .then((response) => {
        if (response.status == 200) {
          // let temp = { ...this.state.communityPagination };
          // temp.total_pages = Math.ceil(
          //   response.data.total / this.state.communityPagination.size
          // );
          this.setState({
            communities: response.data.com,
            communityPagination: {
              ...this.state.communityPagination,
              total_pages: Math.ceil(
                response.data.total / this.state.communityPagination.size
              ),
              total_count: response.data.total,
            },
          });
          // console.log(response.data);
        }
      })
      .catch((error) => console.log("error " + error));
  };

  getUsersForCommunitiesCreatedByUser = async () => {
    const ownerID = getMongoUserID(); //TO DO: Take it from JWT TOKEN AFTER LOGIN
    await axios
      .get(`${backendServer}/getUsersForCommunitiesForOwner?ID=${ownerID}`)
      .then(async (response) => {
        if (response.status == 200) {
          await axios
            .post(backendServer + "/getListedUserDetails", {
              usersList: response.data,
              size: this.state.userPagination.size,
              page: this.state.userPagination.page - 1,
              search: this.state.userPagination.search,
            })
            .then((res) => {
              this.setState({
                usersFromCommunities: res.data.users,
                userPagination: {
                  ...this.state.userPagination,
                  total_pages: Math.ceil(
                    response.data.total / this.state.userPagination.size
                  ),
                  total_count: response.data.total,
                },
              });
            })
            .catch((err) => {
              // this.props.unsetLoader();
              console.log(err);
            });
        }
      })
      .catch((error) => console.log("error " + error));
  };

  componentDidMount = async () => {
    this.getCommunitiesCreatedByUser();
    this.getUsersForCommunitiesCreatedByUser();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      this.state.communityPagination.page !==
        prevState.communityPagination.page ||
      this.state.communityPagination.size !==
        prevState.communityPagination.size ||
      this.state.communityPagination.search !==
        prevState.communityPagination.search ||
      this.state.userPagination.page !== prevState.userPagination.page ||
      this.state.userPagination.size !== prevState.userPagination.size ||
      this.state.userPagination.search !== prevState.userPagination.search ||
      this.state.showCommunityModal !== prevState.showCommunityModal ||
      this.state.showUserModal !== prevState.showUserModal
    ) {
      this.getCommunitiesCreatedByUser();
      this.getUsersForCommunitiesCreatedByUser();
    }
  };

  render() {
    console.log(this.state);
    let communitiesList = [];
    let communityCount = 1;
    let usersList = [];
    let userCount = 1;

    const renderCommunityModal = (
      <Modal
        show={this.state.showCommunityModal}
        onHide={() => this.setState({ showCommunityModal: false })}
        dialogClassName="landingDailogStyle"
        contentClassName="landingContentStyle"
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
      >
        {" "}
        <Modal.Body style={{ padding: "0" }}>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{ padding: "20px", fontSize: "24px" }}
          >
            <FiX onClick={() => this.setState({ showCommunityModal: false })} />
          </button>
          <React.Fragment>
            <CommunityModal comm_id={this.state.selectedCommunity} />
          </React.Fragment>
        </Modal.Body>
      </Modal>
    );

    this.state.communities
      ? this.state.communities.forEach((item) => {
          communitiesList.push(
            <Row
              key={item._id}
              className={
                this.props.dark_mode ? "cardrow-dark" : "cardrow-light"
              }
              style={{ margin: "0", padding: "15px 0", cursor: "pointer" }}
              onClick={async () => {
                await this.setState({
                  selectedCommunity: item._id,
                  showCommunityModal: true,
                });
              }}
            >
              <Col xs={2}>{communityCount}.</Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 30px 0 0",
                }}
              >
                <div style={{ fontWeight: "700" }}>r/{item.communityName}</div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      marginRight: "10px",
                    }}
                  >
                    Number of requests:
                  </div>
                  <strong>{item.requestedUserSQLIds.length}</strong>
                </div>
              </Col>
            </Row>
          );
          communityCount++;
        })
      : null;

    this.state.usersFromCommunities
      ? this.state.usersFromCommunities.forEach((item) => {
          usersList.push(
            <Row
              key={item._id}
              className={
                this.props.dark_mode ? "cardrow-dark" : "cardrow-light"
              }
              style={{ margin: "0", padding: "15px 0" }}
            >
              <Col
                xs={2}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {userCount}.
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 30px 0 0",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  u/{item.name}
                </div>
                <div
                  style={{
                    display: "block",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#ccc",
                    borderRadius: "5px",
                    border: "1px solid #777",
                  }}
                >
                  .
                </div>
              </Col>
            </Row>
          );
          userCount++;
        })
      : null;

    let comm_entries = {};
    if (this.state.communities) {
      if (
        (this.state.communityPagination.page - 1) *
          this.state.communityPagination.size +
          this.state.communityPagination.size <
        this.state.communityPagination.total_count
      ) {
        comm_entries = (
          <div>
            {(this.state.communityPagination.page - 1) *
              this.state.communityPagination.size +
              1}{" "}
            -{" "}
            {(this.state.communityPagination.page - 1) *
              this.state.communityPagination.size +
              this.state.communityPagination.size}{" "}
            of {this.state.communityPagination.total_count}
          </div>
        );
      } else {
        if (
          (this.state.communityPagination.page - 1) *
            this.state.communityPagination.size +
            1 ===
          this.state.communityPagination.total_count
        ) {
          comm_entries = (
            <div>
              {this.state.communityPagination.total_count} of{" "}
              {this.state.communityPagination.total_count}
            </div>
          );
        } else {
          comm_entries = (
            <div>
              {(this.state.communityPagination.page - 1) *
                this.state.communityPagination.size +
                1}{" "}
              - {this.state.communityPagination.total_count} of{" "}
              {this.state.communityPagination.total_count}
            </div>
          );
        }
      }
    }

    let user_entries = {};
    if (this.state.usersFromCommunities) {
      if (
        (this.state.userPagination.page - 1) * this.state.userPagination.size +
          this.state.userPagination.size <
        this.state.usersFromCommunities.length
      ) {
        user_entries = (
          <div>
            {(this.state.userPagination.page - 1) *
              this.state.userPagination.size +
              1}{" "}
            -{" "}
            {(this.state.userPagination.page - 1) *
              this.state.userPagination.size +
              this.state.userPagination.size}{" "}
            of {this.state.usersFromCommunities.length}
          </div>
        );
      } else {
        if (
          (this.state.userPagination.page - 1) *
            this.state.userPagination.size +
            1 ===
          this.state.usersFromCommunities.length
        ) {
          user_entries = (
            <div>
              {this.state.usersFromCommunities.length} of{" "}
              {this.state.usersFromCommunities.length}
            </div>
          );
        } else {
          user_entries = (
            <div>
              {(this.state.userPagination.page - 1) *
                this.state.userPagination.size +
                1}{" "}
              - {this.state.usersFromCommunities.length} of{" "}
              {this.state.usersFromCommunities.length}
            </div>
          );
        }
      }
    }

    return (
      <React.Fragment>
        <div style={{ height: "90vh" }}>
          {renderCommunityModal}
          {/* <div style={{ margin: "20px" }}>
            {JSON.stringify(this.state.usersFromCommunities)}
          </div> */}
          <Row
            style={{
              margin: "0",
              padding: "20px 0 0 0",
              justifyContent: "center",
            }}
          >
            <Col xs={4} style={{ padding: "0" }}>
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    Communities
                  </div>
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid #777",
                      padding: "5px 10px",
                      borderRadius: "15px",
                    }}
                  >
                    <input
                      type="text"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onChange={(e) =>
                        // this.setState({ comm_search: e.target.value })
                        this.setState({
                          communityPagination: {
                            ...this.state.communityPagination,
                            search: e.target.value,
                            page: 1,
                          },
                        })
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontSize: "24px",
                        marginLeft: "5px",
                      }}
                    >
                      <BiSearchAlt />
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ padding: "10px 0", height: "60vh" }}
                >
                  {communitiesList}
                </div>
                <div className="card-footer" style={{ padding: "0" }}>
                  <div
                    className="row"
                    style={{
                      margin: "0",
                      padding: "15px 10px",
                      borderBottom: "1px solid #ddd",
                      borderTop: "1px solid #ddd",
                      backgroundColor: "rgb(238, 238, 238)",
                    }}
                  >
                    {/* <div className="col-1"></div> */}
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 12px 0 0",
                      }}
                    >
                      <div style={{ marginRight: "10px", fontSize: "12px" }}>
                        Rows per page:
                      </div>
                      <div>
                        <select
                          name="pagesize"
                          id="pagesize"
                          style={{ fontSize: "11px" }}
                          onChange={(e) => {
                            this.setState({
                              communityPagination: {
                                ...this.state.communityPagination,
                                size: Number(e.target.value),
                                page: 1,
                              },
                            });
                          }}
                        >
                          <option value="2">2</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0",
                        textAlign: "center",
                      }}
                    >
                      {comm_entries}
                    </div>
                    <div
                      className="col pagination-icons"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingRight: "0",
                      }}
                    >
                      <div
                        onClick={() => {
                          this.setState({
                            communityPagination: {
                              ...this.state.communityPagination,
                              page: 1,
                            },
                          });
                        }}
                      >
                        <i className="fa fa-angle-double-left"></i>
                      </div>
                      <div
                        onClick={() => {
                          if (this.state.communityPagination.page > 1) {
                            this.setState({
                              communityPagination: {
                                ...this.state.communityPagination,
                                page: this.state.communityPagination.page - 1,
                              },
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-left"></i>
                      </div>
                      <div className="pageno">
                        {this.state.communityPagination.page}
                      </div>
                      <div
                        onClick={() => {
                          if (
                            this.state.communityPagination.page <
                            this.state.communityPagination.total_pages
                          ) {
                            this.setState({
                              communityPagination: {
                                ...this.state.communityPagination,
                                page: this.state.communityPagination.page + 1,
                              },
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-right"></i>
                      </div>
                      <div
                        onClick={() => {
                          this.setState({
                            communityPagination: {
                              ...this.state.communityPagination,
                              page:
                                this.state.communityPagination.total_pages > 0
                                  ? this.state.communityPagination.total_pages
                                  : 1,
                            },
                          });
                        }}
                      >
                        <i className="fa fa-angle-double-right"></i>
                      </div>
                    </div>
                    {/* <div className="col-1"></div> */}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={1}></Col>

            <Col xs={4} style={{ padding: "0" }}>
              <div className="card">
                <div
                  className="card-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    Users
                  </div>
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid #777",
                      padding: "5px 10px",
                      borderRadius: "15px",
                    }}
                  >
                    <input
                      type="text"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onChange={(e) =>
                        // this.setState({ user_search: e.target.value })
                        this.setState({
                          userPagination: {
                            ...this.state.userPagination,
                            search: e.target.value,
                            page: 1,
                          },
                        })
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontSize: "24px",
                        marginLeft: "5px",
                      }}
                    >
                      <BiSearchAlt />
                    </div>
                  </div>
                </div>
                <div
                  className="card-body"
                  style={{ padding: "10px 0", height: "60vh" }}
                >
                  {usersList}
                </div>
                <div className="card-footer" style={{ padding: "0" }}>
                  <div
                    className="row"
                    style={{
                      margin: "0",
                      padding: "15px 10px",
                      borderBottom: "1px solid #ddd",
                      borderTop: "1px solid #ddd",
                      backgroundColor: "rgb(238, 238, 238)",
                    }}
                  >
                    {/* <div className="col-1"></div> */}
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0 12px 0 0",
                      }}
                    >
                      <div style={{ marginRight: "10px", fontSize: "12px" }}>
                        Rows per page:
                      </div>
                      <div>
                        <select
                          name="pagesize"
                          id="pagesize"
                          style={{ fontSize: "11px" }}
                          onChange={(e) => {
                            this.setState({
                              userPagination: {
                                ...this.state.userPagination,
                                size: Number(e.target.value),
                                page: 1,
                              },
                            });
                          }}
                        >
                          <option value="2">2</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="col"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "0",
                        textAlign: "center",
                      }}
                    >
                      {user_entries}
                    </div>
                    <div
                      className="col pagination-icons"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        paddingRight: "0",
                      }}
                    >
                      <div
                        onClick={() => {
                          this.setState({
                            userPagination: {
                              ...this.state.userPagination,
                              page: 1,
                            },
                          });
                        }}
                      >
                        <i className="fa fa-angle-double-left"></i>
                      </div>
                      <div
                        onClick={() => {
                          if (this.state.userPagination.page > 1) {
                            this.setState({
                              userPagination: {
                                ...this.state.userPagination,
                                page: this.state.userPagination.page - 1,
                              },
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-left"></i>
                      </div>
                      <div className="pageno">
                        {this.state.userPagination.page}
                      </div>
                      <div
                        onClick={() => {
                          if (
                            this.state.userPagination.page <
                            this.state.userPagination.total_pages
                          ) {
                            this.setState({
                              userPagination: {
                                ...this.state.userPagination,
                                page: this.state.userPagination.page + 1,
                              },
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-right"></i>
                      </div>
                      <div
                        onClick={() => {
                          this.setState({
                            userPagination: {
                              ...this.state.userPagination,
                              page:
                                this.state.userPagination.total_pages > 0
                                  ? this.state.userPagination.total_pages
                                  : 1,
                            },
                          });
                        }}
                      >
                        <i className="fa fa-angle-double-right"></i>
                      </div>
                    </div>
                    {/* <div className="col-1"></div> */}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default MyCommunitiesModeration;
