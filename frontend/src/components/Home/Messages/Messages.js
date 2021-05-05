import React, { Component } from "react";
import { Col, Row, Container, Modal, Form, Dropdown } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import axios from "axios";
import backendServer from "../../../webConfig";
import "./message.css";
import MessageContent from "./MessageContent";
import {
  getSQLUserID,
  getUserProfile
} from "../../../services/ControllerUtils";
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startNewChatModel: false,
      searchedUser: [],
      selectedUser: [],
      users: [],
      getUniqueMembers: [],
      component: null
    };
  }

  handleUsersSelected = user => {
    this.setState({ startNewChatModel: false });
    const userList = this.state.getUniqueMembers;
    userList.push({ user_id: user.user_id, name: user.name });
    this.setState({
      getUniqueMembers: userList
    });
    console.log(userList);
  };

  getUniqueUsers(users) {
    const user_id = getSQLUserID();
    let userNameList = [];
    users.forEach(user => {
      let keyB = user.sentByUser.user_id;
      if (keyB != user_id) userNameList[keyB] = user.sentByUser;
      let keyT = user.sentToUser.user_id;
      if (keyT != user_id) userNameList[keyT] = user.sentToUser;
    });
    this.setState({
      getUniqueMembers: userNameList
    });
  }

  getUsers() {
    const user_id = getSQLUserID();
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
      this.props.setLoader();
      axios
        .post(`${backendServer}/getSearchedUser`, data)
        .then(response => {
          this.props.unsetLoader();
          if (response.status == 200) {
            this.setState({
              searchedUser: response.data
            });
            console.log(response.data);
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
    let component = this.state.component;
    let peopleChattedWith = null;
    if (component == null) {
      component = (
        <div className="text-center" style={{ padding: "150px" }}>
          <i className="fa fa-envelope" style={{ fontSize: "100px" }}></i>
          <p>
            <b style={{ fontSize: "20px" }}>Your Message </b>
            <br /> Send message to your friends here
          </p>
          <button className="btn btn-primary" onClick={this.startChat}>
            Send Message
          </button>
        </div>
      );
    }
    if (this.state.searchedUser.length > 0) {
      selectedUser = this.state.searchedUser.map(user => {
        console.log(user);
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
    if (this.state.getUniqueMembers.length > 0) {
      peopleChattedWith = this.state.getUniqueMembers.map((member, idx) => {
        return (
          <tr key={idx} onClick={() => this.showMessage(member)}>
            <td>{member.name}</td>
          </tr>
        );
      });
    }
    const modelWindow = (
      <Modal
        show={this.state.startNewChatModel}
        onHide={() => this.setState({ startNewChatModel: false })}
        aria-labelledby="example-custom-modal-styling-title"
        backdrop="static"
      >
        <Modal.Title>
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
            padding: "0",
            height: "400px"
          }}
        >
          <Container>
            <Row>
              <Col xs={1}>
                <Form.Label>
                  <b>To:</b>
                </Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  onChange={this.searchUser}
                  placeholder="Enter a person name to start chat with"
                  required
                />
                <Dropdown className="border">{selectedUser}</Dropdown>
              </Col>
            </Row>
            <Row></Row>
          </Container>
        </Modal.Body>
      </Modal>
    );
    return (
      <React.Fragment>
        <Container>
          <Row className="row">
            <Col xs={3} className="colheight changePadding">
              <div
                className="colheight border"
                style={{ marginLeft: "10px", textAlign: "center" }}
              >
                <label>
                  {getUserProfile() != null
                    ? getUserProfile().name
                    : "Username"}
                </label>
                <button className="btn text-right" onClick={this.startChat}>
                  <i className="fas fa-edit"></i>
                </button>
                <hr />
                <table className="table table-hover changePadding">
                  <tbody>{peopleChattedWith}</tbody>
                </table>
              </div>
            </Col>
            <Col xs={8} className="changePadding border">
              {component}
            </Col>
          </Row>
        </Container>
        {modelWindow}
      </React.Fragment>
    );
  }
}

export default Messages;
