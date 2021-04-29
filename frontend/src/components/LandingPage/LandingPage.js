import React, { Component } from "react";
import { REDDIT } from "../../services/Constants";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import { FiX } from "react-icons/fi";
import "./../styles/landingPageStyle.css";
// import Modal from "@material-ui/core/Modal";
// import Backdrop from "@material-ui/core/Backdrop";
// import Fade from "@material-ui/core/Fade";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignup: false,
    };
  }
  render() {
    const renderLogin = (
      <Modal
        show={this.state.showLogin}
        onHide={() => this.setState({ showLogin: false })}
        dialogClassName="landingDailogStyle"
        contentClassName="landingContentStyle"
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
        animation={false}
      >
        <Modal.Body
          style={{
            padding: "0",
          }}
        >
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{ padding: "20px", fontSize: "24px" }}
          >
            <FiX onClick={() => this.setState({ showLogin: false })} />
          </button>
          <React.Fragment>
            <Login
              signup={() => {
                this.setState({ showLogin: false, showSignup: true });
              }}
            />
          </React.Fragment>
        </Modal.Body>
      </Modal>
    );

    const renderSignup = (
      <Modal
        show={this.state.showSignup}
        onHide={() => this.setState({ showSignup: false })}
        dialogClassName="landingDailogStyle"
        contentClassName="landingContentStyle"
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
        animation={false}
      >
        <Modal.Body
          style={{
            padding: "0",
          }}
        >
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{ padding: "20px", fontSize: "24px" }}
          >
            <FiX onClick={() => this.setState({ showSignup: false })} />
          </button>
          <React.Fragment>
            <Signup />
          </React.Fragment>
        </Modal.Body>
      </Modal>
    );
    return (
      <React.Fragment>
        {REDDIT}
        IAM IN LANDING PAGE
        <div style={{ margin: "auto" }}>
          <Link to={"/home"} className="btn btn-primary">
            Go to post login page ( HOME )
          </Link>
          <button onClick={() => this.setState({ showLogin: true })}>
            Login
          </button>
          <button onClick={() => this.setState({ showSignup: true })}>
            Sign Up
          </button>

          {renderLogin}
          {renderSignup}
        </div>
      </React.Fragment>
    );
  }
}

export default LandingPage;
