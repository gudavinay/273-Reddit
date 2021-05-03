import React, { Component } from "react";
import { Col, Row, Container, Modal, Form, Dropdown } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import axios from "axios";
import backendServer from "../../../webConfig";
import Paper from "@material-ui/core/Paper";
import "./message.css";
import MessageContent from "./MessageContent";
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNewChatModel: false,
      searchedUser: [],
      selectedUser: [],
      users: [],
      getUniqueMembers: [],
      component: null,
      loggedinUser: { user_id: 3 }
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

  getUniqueUsers(users) {
    console.log(users);
    let userNameList = [];
    users.forEach(user => {
      let keyB = user.sentByUser.user_id;
      if (keyB != this.state.loggedinUser.user_id)
        userNameList[keyB] = user.sentByUser;
      let keyT = user.sentToUser.user_id;
      if (keyT != this.state.loggedinUser.user_id)
        userNameList[keyT] = user.sentToUser;
    });
    this.setState({
      getUniqueMembers: userNameList
    });
  }

  getUsers() {
    const user_id = 3;
    axios
      .get(`${backendServer}/getMessageUserNames?ID=${user_id}`)
      .then(response => {
        if (response.status == 200) {
          this.setState({
            message: response.data
          });
          this.getUniqueUsers(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  searchUser = e => {
    console.log(e);
    if (e.target.value.length > 1) {
      const data = { name: e.target.value };
      axios
        .post(`${backendServer}/getSearchedUser`, data)
        .then(response => {
          if (response.status == 200) {
            this.setState({
              searchedUser: response.data
            });
          }
        })
        .catch(error => {
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
  componentDidMount() {
    this.getUsers();
  }

  showMessage = member => {
    this.setState({
      component: <MessageContent chattedWith={member} />
    });
  };

  render() {
    let selectedUser = null;
    let showSelectedUser = null;
    let peopleChattedWith = null;
    if (this.state.getUniqueMembers.length > 0) {
      peopleChattedWith = this.state.getUniqueMembers.map((member, idx) => {
        return (
          <tr key={idx} onClick={() => this.showMessage(member)}>
            <td>{member.name}</td>
          </tr>
        );
      });
    }
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
          <Row className="row">
            <Col xs={3} className="colheight changePadding">
              <div className="colheight border">
                <label>Divya Mittal</label>
                <button className="btn text-right" onClick={this.startChat}>
                  <i className="fas fa-edit"></i>
                </button>
                <table className="table table-hover changePadding">
                  <tbody>{peopleChattedWith}</tbody>
                </table>
              </div>
            </Col>
            <Col xs={9} className="changePadding border">
              {this.state.component}
            </Col>
          </Row>
        </Container>
        {renderLogin}
      </React.Fragment>
    );
  }
}

export default Messages;
