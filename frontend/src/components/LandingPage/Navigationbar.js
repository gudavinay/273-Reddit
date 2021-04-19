import React, { Component } from "react";
import { Row, Col, Container, Navbar, NavDropdown, Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import redditLogoSVG from '../../assets/redditLogo.svg';
import redditTextSVG from '../../assets/redditText.svg';

class Navigationbar extends Component {

  render() {
    return (
      <React.Fragment>
        <Container>
          <Navbar  style={{ background: 'white' }}>
            <Row style={{ display: 'contents' }}>
              <Col sm={2}>
                <Navbar.Brand href="#">
                  <img style={{ height: '30px', width: '30px' }} alt="Reddit Logo" src={redditLogoSVG} />
                  <img style={{ height: '30px', width: '30px' }} alt="Reddit Logo" src={redditTextSVG} />
                </Navbar.Brand>
              </Col>
              <Col sm={2}>
                <NavDropdown title="Home" id="collasible-nav-dropdown">
                  <NavDropdown.Item ><Link to="/home">home</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/popular">Popular</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/all">All</Link></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item ><Link to="/topcommunities">Top Communities</Link></NavDropdown.Item>
                </NavDropdown>
              </Col>
              <Col sm={4}>
                <Form>
                  <Form.Group controlId="search">
                    <Form.Control type="text" placeholder="Search" />
                  </Form.Group>
                </Form>
              </Col>
              <Col sm={2}>
                icons
            </Col>
              <Col sm={2}>
                <NavDropdown title="User 1" id="collasible-nav-dropdown">
                  <NavDropdown.Item ><Link to="/userprofile">Profile</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/settings">Settings</Link></NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item ><Link to="/logout">Logout</Link></NavDropdown.Item>
                </NavDropdown>
              </Col>
            </Row>
          </Navbar>
        </Container>
      </React.Fragment>
    )
  }
}

export default Navigationbar;
