import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navigationbar from "../../LandingPage/Navigationbar";

class MyCommunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
    };
  }

  render() {
    return (
      <React.Fragment>
        {/* <Navigationbar /> */}
        <div className="container">
          <div className="col-sm-8"></div>
          <div className="col-sm-4">
            <Link to="/createCommunity">
              <Button>Create Community</Button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyCommunities;
