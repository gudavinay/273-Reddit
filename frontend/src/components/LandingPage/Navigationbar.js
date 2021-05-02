import React, { Component } from "react";
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Container,
  Navbar,
  NavDropdown,
  Form
} from "react-bootstrap";
import { Link } from "react-router-dom";
import qs from "query-string";
import Switch from '@material-ui/core/Switch';
import redditLogoSVG from "../../assets/redditLogo.svg";
import redditTextSVG from "../../assets/redditText.svg";
import LinearProgress from '@material-ui/core/LinearProgress';

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    console.log("PROPS in NAVIGATION BAR", this.props);
    const qR = qs.parse(props.location.search);
    this.state = {
      search: qR.q || ""
    };
  }
  onSubmitSearch = (e) => {
    e.preventDefault();
    if (this.state.search.trim() === "") return;
    this.processSearchSubmitActivity();
  }
  onChangeSearchText = (e) => this.setState({ search: e.target.value })
  processSearchSubmitActivity = () => {
    const { pathname } = this.props.location;
    if (pathname === "/communitysearch") {
      this.props.history.push({
        pathname: '/communitysearch',
        search: "?" + new URLSearchParams({ q: this.state.search }).toString()
      })
    } else {
      // Write logic for posts search
    }
  }
  render() {
    return (
      <React.Fragment>
        {this.props.loading && <LinearProgress color="secondary" style={{ backgroundColor: this.props.darkMode ? '#363537' : 'white' }} />}
        <Container>
          <Navbar>
            <Row style={{ display: "contents" }}>
              <Col sm={2}>
                <Navbar.Brand href="#">
                  <img
                    style={{ height: "30px", width: "30px" }}
                    alt="Reddit Logo"
                    src={redditLogoSVG}
                  />
                  <img
                    style={{ height: "30px", width: "30px" }}
                    alt="Reddit Logo"
                    src={redditTextSVG}
                  />
                </Navbar.Brand>
              </Col>
              <Col sm={2}>
                <NavDropdown title="Home" id="collasible-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/home">home</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/popular">Popular</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/all">All</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <Link to="/mycommunities">My Community</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Col>
              <Col sm={4}>
                <Form onSubmit={this.onSubmitSearch}>
                  <Form.Group controlId="search">
                    <Form.Control value={this.state.search} onChange={this.onChangeSearchText} type="text" placeholder="Search" />
                  </Form.Group>
                </Form>
              </Col>
              <Col sm={1}>icons</Col>
              <Col sm={2}>
                <NavDropdown title="User 1" id="collasible-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to="/userprofile">Profile</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/settings">Settings</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <Link to="/login">Logout</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Col>
              <Col sm={2}>
                <div>Dark Mode<Switch checked={this.props.darkMode} onChange={() => { this.props.themeToggler() }} color="primary" name="checkedB" inputProps={{ 'aria-label': 'primary checkbox' }} /></div>
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
  {}
)(Navigationbar);