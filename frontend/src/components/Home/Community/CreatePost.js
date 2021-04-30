import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Button, Card, Col, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Input } from 'reactstrap';
import createPostRulesSVG from '../../../assets/createPostRules.svg'
import Axios from 'axios';
import backendServer from '../../../webConfig';

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            community_id: props.location.params
        }
        console.log("PROPS AND STATE in create post", this.props, this.state);
    }

    render() {
        const titleTag = (<Input type="text" className="form-control" placeholder="Title" id="title" name="post" onChange={(e) => { this.setState({ title: e.target.value }) }} />);
        const postButton = (<Button type="submit" style={{ display: 'block', float: 'right' }} variant="light">Post</Button>);
        return (
            <React.Fragment>
                inside CreatePost ... {this.props.content}
                <Row>
                    <Col sm={8}>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            Axios.post(backendServer + '/createPost', this.state, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log(result);
                            })
                        }}>
                            {JSON.stringify(this.state)}
                            <Tabs defaultActiveKey="0" id="tabs" onSelect={(eventKey) => { this.setState({ type: eventKey }) }}>
                                <Tab eventKey="0" title="Post">
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Text (optional)" id="description" name="description" onChange={(e) => { this.setState({ description: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="2" title="Images">
                                    {titleTag}
                                    <input type="file" className="form-control" id="files" name="files" accept="image/*" multiple></input>
                                    {postButton}
                                </Tab>
                                <Tab eventKey="1" title="Link">
                                    {titleTag}
                                    <Input type="text" className="form-control" placeholder="Url" id="link" name="link" onChange={(e) => { this.setState({ link: e.target.value }) }} />
                                    {postButton}
                                </Tab>
                                <Tab eventKey="poll" title="Poll" disabled>
                                </Tab>
                            </Tabs>
                        </Form>
                    </Col>
                    <Col sm={4}>
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
                </Row>

            </React.Fragment>
        );
    }
}


export default CreatePost;