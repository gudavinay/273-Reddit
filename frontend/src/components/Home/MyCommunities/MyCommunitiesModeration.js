import React, { Component } from "react";
import axios from "axios";
import backendServer from "../../../webConfig";
import { Col, Row } from "reactstrap";
import { BiSearchAlt } from "react-icons/bi";
import "./myCommunityModeration.css";

class MyCommunitiesModeration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityPagination: {
        page: 1,
        size: 2,
        total_pages: 0,
      },
      UserPagination: {
        page: 1,
        size: 2,
        total_pages: 0,
      },
      communities: [],
    };
  }

  getCommunitiesCreatedByUser = async () => {
    const ownerID = "6089d63ea112c02c1df2914c"; //TO DO: Take it from JWT TOKEN AFTER LOGIN
    await axios
      .get(`${backendServer}/getCommunitiesForOwner?ID=${ownerID}`)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            communities: response.data,
          });
        }
      })
      .catch((error) => console.log("error " + error));
  };

  getUsersForCommunitiesCreatedByUser = async () => {
    const ownerID = "6089d63ea112c02c1df2914c"; //TO DO: Take it from JWT TOKEN AFTER LOGIN
    await axios
      .get(`${backendServer}/getUsersForCommunitiesForOwner?ID=${ownerID}`)
      .then(async (response) => {
        if (response.status == 200) {
          await axios
            .post(backendServer + "/getListedUserDetails", {
              usersList: response.data,
            })
            .then((res) => {
              this.setState({
                usersFromCommunities: res.data,
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

  render() {
    console.log(this.props);
    let communitiesList = [];
    let communityCount = 1;
    let usersList = [];
    let userCount = 1;

    this.state.communities
      ? this.state.communities.forEach((item) => {
          communitiesList.push(
            <Row
              key={item._id}
              className={
                this.props.dark_mode ? "cardrow-dark" : "cardrow-light"
              }
              style={{ margin: "0", padding: "15px" }}
            >
              <Col xs={2}>{communityCount}.</Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 30px",
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
              style={{ margin: "0", padding: "15px" }}
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
                  padding: "0 30px",
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

    return (
      <React.Fragment>
        <div style={{ height: "90vh" }}>
          <div style={{ margin: "20px" }}>
            {JSON.stringify(this.state.usersFromCommunities)}
          </div>
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
                      padding: "15px 0",
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
                          onChange={(e) => {
                            this.setState({
                              size: Number(e.target.value),
                              page: 1,
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
                      {/* {entryCount} */}
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
                            page: 1,
                          });
                        }}
                      >
                        <i className="fa fa-angle-double-left"></i>
                      </div>
                      <div
                        onClick={() => {
                          if (this.state.page > 1) {
                            this.setState({
                              page: this.state.page - 1,
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-left"></i>
                      </div>
                      <div className="pageno">{this.state.page}10</div>
                      <div
                        onClick={() => {
                          if (this.state.page < this.state.total_pages) {
                            this.setState({
                              page: this.state.page + 1,
                            });
                          }
                        }}
                      >
                        <i className="fa fa-angle-right"></i>
                      </div>
                      <div
                        onClick={() => {
                          this.setState({
                            page: this.state.total_pages,
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
                <div className="card-footer">2 days ago</div>
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default MyCommunitiesModeration;
