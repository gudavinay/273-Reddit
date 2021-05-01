import React, { Component } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "./invitation.css";
import { Input } from "reactstrap";

export class invitation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <React.Fragment>
          <Container style={{ padding: "0 15%" }}>
            <Card>
              <Card.Header
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  Approved Users
                </div>
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #777",
                    padding: "0 10px",
                    borderRadius: "25px",
                  }}
                >
                  <Input
                    style={{ border: "0", backgroundColor: "transparent" }}
                    type="text"
                    placeholder="Search User"
                  />
                  <div
                    style={{
                      justifyContent: "center",
                      flexDirection: "column",
                      display: "flex",
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {/* <Card.Title>Special title treatment</Card.Title> */}
                <Card.Text>
                  With supporting text below as a natural lead-in to additional
                  content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Container>
        </React.Fragment>
      </div>
    );
  }
}

export default invitation;
