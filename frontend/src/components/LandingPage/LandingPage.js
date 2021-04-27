import React, { Component } from "react";
import { REDDIT } from "../../services/Constants";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Login from '../Login/Login'
import Signup from '../Signup/Signup'

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false,
      showSignup: false
    };
  }
  render() {
    const renderLogin = (
      <Modal show={this.state.showLogin} onHide={() => this.setState({ showLogin: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.Fragment>
            <center>
              <Login />
            </center>
          </React.Fragment>
        </Modal.Body>
      </Modal>
    );

    const renderSignup = (
      <Modal show={this.state.showSignup} onHide={() => this.setState({ showSignup: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.Fragment>
            <center>
              <Signup />
            </center>
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
          <button onClick={() => this.setState({ showLogin: true })}>Login</button>
          <button onClick={() => this.setState({ showSignup: true })}>Sign Up</button>

          {renderLogin}
          {renderSignup}



        </div>
      </React.Fragment>
    );

  }
}



export default LandingPage;
