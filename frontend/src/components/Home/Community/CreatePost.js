import React, { Component } from 'react';
// import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Nav, Row } from 'react-bootstrap';
import { Input } from 'reactstrap';
import createPostRulesSVG from '../../../assets/createPostRules.svg'
import Axios from 'axios';
import backendServer from '../../../webConfig';
import { getMongoUserID } from '../../../services/ControllerUtils';
import './CreatePost.css'


class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            community_id: props.location.params,
            type: "0",
            title: null,
            link: null,
            description: null,
            user_id: getMongoUserID()
        }
        console.log("PROPS AND STATE in create post", this.props, this.state);
    }

    render() {
        const titleTag = (<Input type="text" style={{ margin: '15px 0' }} className="form-control" placeholder="Title" id="title" name="post" onChange={(e) => { this.setState({ title: e.target.value }) }} />);
        const postButton = (<Button type="submit" style={{ display: 'block', float: 'right', margin: '10px', width: '82px', borderRadius: '50px', backgroundColor: this.state.title ? "#0266b3" : "#777", color: 'white', fontWeight: '500' }} variant="light">Post</Button>);
        return (
            <React.Fragment>
                inside CreatePost ... {this.props.content}
                <Row>
                    <Col sm={1}></Col>
                    <Col sm={7}>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            this.props.setLoader();
                            Axios.post(backendServer + '/createPost', this.state).then((result) => {
                                this.props.unsetLoader();
                                console.log(result);
                            }).catch((err) => {
                                this.props.unsetLoader();
                                console.log(err);
                            })

                        }}>
                            {JSON.stringify(this.state)}
                            {/* <Tabs defaultActiveKey="0" id="tabs" onSelect={(eventKey) => { this.setState({ type: eventKey }) }}>
                                <Tab eventKey="0" title="Post" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Text (optional)" id="description" name="description" onChange={(e) => { this.setState({ description: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="2" title="Images" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <input type="file" className="form-control" id="files" name="files" accept="image/*" multiple></input>
                                    {postButton}
                                </Tab>
                                <Tab eventKey="1" title="Link" style={{ padding: '3%' }}>
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Url" id="link" name="link" onChange={(e) => { this.setState({ link: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="poll" title="Poll" disabled style={{ padding: '3%' }}>
                                </Tab>
                            </Tabs> */}

                            <Tab.Container id="left-tabs-example" defaultActiveKey="0" onSelect={(eventKey) => { this.setState({ type: eventKey, title: null, link: null, description: null }) }}>
                                <Row>
                                    <Row >
                                        <Nav variant="tabs" className="flex-row">
                                            <Nav.Item>
                                                <Nav.Link className="navLinkV" eventKey="0">
                                                    <span className="tabElement"><i className="fa fa-comment-alt" style={{ width: '15px', margin: '10px' }} />Post</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className="navLinkV" eventKey="2"><span className="tabElement"><i className="fa fa-image" style={{ width: '15px', margin: '10px' }} />Images</span></Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className="navLinkV" eventKey="1"><span className="tabElement"><i className="fa fa-link" style={{ width: '15px', margin: '10px' }} />Link</span></Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link className="navLinkV" ventKey="3" disabled ><span className="tabElement" style={{ cursor: 'not-allowed' }}><i className="fa fa-poll" style={{ width: '15px', margin: '10px' }} />Poll</span></Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Row>
                                    <Row >
                                        <Tab.Content>
                                            <Tab.Pane eventKey="0">
                                                {titleTag}
                                                <Input type="text" className="form-control" placeholder="Text (optional)" id="description" name="description" onChange={(e) => { this.setState({ description: e.target.value }) }} />
                                                {postButton}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="2">
                                                {titleTag}
                                                <input type="file" className="form-control" id="files" name="files" accept="image/*" multiple></input>
                                                {postButton}
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="1">
                                                {titleTag}
                                                <Input type="text" className="form-control" placeholder="Url" id="link" name="link" onChange={(e) => { this.setState({ link: e.target.value }) }} />
                                                {postButton}
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Row>
                                </Row>
                            </Tab.Container>
                        </Form>
                    </Col>
                    <Col sm={3}>
                        <Row>
                            <Card className="card">
                                <Card.Header className="cardHeader">
                                    <img alt="" height="40px" src={createPostRulesSVG} />  SELECTED COMM NAME
                                </Card.Header>
                                <Card.Body>
                                    <ListGroup>
                                        <ListGroupItem>SELECTED COMM RULES</ListGroupItem>
                                        {/* <ListGroupItem>Behave like you would in real life</ListGroupItem>
                                        <ListGroupItem>Look for the original source of content</ListGroupItem>
                                        <ListGroupItem>Search for duplicates before posting</ListGroupItem>
                                        <ListGroupItem>Read the community’s rules</ListGroupItem> */}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row>
                            <Card className="card">
                                <Card.Header className="cardHeader">
                                    <img alt="" height="40px" src={createPostRulesSVG} />  Posting to Reddit
                                </Card.Header>
                                <Card.Body>
                                    <ListGroup>
                                        <ListGroupItem>Remember the human</ListGroupItem>
                                        <ListGroupItem>Behave like you would in real life</ListGroupItem>
                                        <ListGroupItem>Look for the original source of content</ListGroupItem>
                                        <ListGroupItem>Search for duplicates before posting</ListGroupItem>
                                        <ListGroupItem>Read the community’s rules</ListGroupItem>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                    <Col sm={1}></Col>
                </Row>

            </React.Fragment>
        );
    }
}


export default CreatePost;