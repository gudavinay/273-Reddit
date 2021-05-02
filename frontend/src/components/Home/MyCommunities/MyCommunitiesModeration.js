import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import { BiSearchAlt } from "react-icons/bi";
import "./communityModeration.css";

class MyCommunitiesModeration extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ height: "90vh", backgroundColor: "lightgray" }}>
          <Row style={{ margin: "0", padding: "0 50px" }}>
            <Col style={{ padding: "30px 50px" }}>
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
                <div className="card-body">
                  <h5 className="card-title">Special title treatment</h5>
                  <p className="card-text">
                    With supporting text below as a natural lead-in to
                    additional content.
                  </p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
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
            <Col style={{ padding: "30px 50px" }}>
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
                <div className="card-body">
                  <h5 className="card-title">Special title treatment</h5>
                  <p className="card-text">
                    With supporting text below as a natural lead-in to
                    additional content.
                  </p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
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
