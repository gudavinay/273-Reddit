import React, { Component } from "react";
import {
  Col,
  Row,
  Container,
  Card,
  Modal,
  Form,
  Dropdown
} from "react-bootstrap";
import { FiX } from "react-icons/fi";
import axios from "axios";
import backendServer from "../../../webConfig";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNewChatModel: false,
      searchedUser: [],
      selectedUser: []
    };
  }

  handleUsersSelected = user => {
    this.setState(prevState => ({
      selectedUser: [
        ...prevState.selectedUser,
        {
          user_id: user.user_id,
          name: user.name
        }
      ]
    }));
    console.log(this.state.selectedUser);
  };

  searchUser = e => {
    console.log(e);
    if (e.target.value.length > 1) {
      const data = { name: e.target.value };
      this.props.setLoader();
      axios.post(`${backendServer}/getSearchedUser`, data)
        .then(response => {
          this.props.unsetLoader();
          if (response.status == 200) {
            this.setState({
              searchedUser: response.data
            });
          }
        })
        .catch(error => {
          this.props.unsetLoader();
          console.log(error);
        });
    }
  };

  startChat = e => {
    console.log(e);
    this.setState({
      startNewChatModel: true
    });
  };
  componentDidMount() { }

  render() {
    let selectedUser = null;
    let showSelectedUser = null;
    if (this.state.searchedUser.length > 0) {
      selectedUser = this.state.searchedUser.map(user => {
        return (
          <Dropdown.Item
            key={user.user_id}
            onClick={() => this.handleUsersSelected(user)}
          >
            {user.name}
          </Dropdown.Item>
        );
      });
      if (this.state.selectedUser.length > 0) {
        showSelectedUser = this.state.selectedUser.map(user => {
          return (
            <Chip
              key={user.user_id}
              label={user.name}
              onDelete={e => this.handleDelete(e, user)}
              className="chip"
            />
          );
        });
      }
    }
    const renderLogin = (
      <Modal
        show={this.state.startNewChatModel}
        onHide={() => this.setState({ startNewChatModel: false })}
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
      >
        <Modal.Title className="border-bottom">
          New Message
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            style={{ padding: "20px", fontSize: "24px" }}
          >
            <FiX onClick={() => this.setState({ startNewChatModel: false })} />
          </button>
        </Modal.Title>
        <Modal.Body
          style={{
            padding: "0"
          }}
        >
          <React.Fragment>
            <Container>
              <Row>
                <Col xs={1}>
                  <Form.Label>
                    <b>To:</b>
                  </Form.Label>
                </Col>
                <Col className="border-bottom">
                  <Form.Control
                    type="text"
                    onChange={this.searchUser}
                    placeholder="Enter a person name to start chat with"
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Paper component="ul" className="root">
                  {showSelectedUser}
                </Paper>
                <Dropdown>
                  <Dropdown.Menu>{selectedUser}</Dropdown.Menu>
                </Dropdown>
              </Row>
            </Container>
          </React.Fragment>
        </Modal.Body>
      </Modal>
    );
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs={3} className="colheight">
              <Card>
                <Card.Header className="text-right">
                  Divya Mittal
                  <button className="btn" onClick={this.startChat}>
                    <i className="fas fa-edit"></i>
                  </button>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xs={9}></Col>
          </Row>
          {renderLogin}
        </Container>
      </React.Fragment>
    );
  }
}

export default Messages;
