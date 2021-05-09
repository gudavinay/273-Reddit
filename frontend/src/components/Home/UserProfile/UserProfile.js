import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import backendServer from '../../../webConfig';
import { getDefaultRedditProfilePicture, getMongoUserID } from '../../../services/ControllerUtils';
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // name: getUserName(),
            // email: getUserEmail().toLowerCase(),
            // phone: getUserPhone(),
            // currency: getUserCurrencyDesc(),
            // language: getUserLanguage(),
            // timezone: getUserTimezone(),
            // s3URL: getProfilePicture(),
            saveSuccess: false,
            saveFailed: false,
            getDefaultRedditProfilePicture: getDefaultRedditProfilePicture(),
            radios: [
                { name: 'Male', value: 'Male' },
                { name: 'Female', value: 'Female' },
                { name: 'Other', value: 'Other' },
            ],
            gender: 'Male',
            checked: false

        }
    }

    componentDidMount() {
        this.props.setLoader();
        axios.get(`${backendServer}/getUserProfileByMongoID?ID=${getMongoUserID()}`).then((result) => {
            this.props.unsetLoader();
            this.setState({ ...result.data })
        }).catch(err => {
            this.props.unsetLoader();
            console.log(err);
        });


        axios.get(`${backendServer}/getTopic`).then((result) => {
            this.props.unsetLoader();
            console.log(result);
            this.setState({ listOfTopicsFromDB: result.data })
        }).catch(err => {
            this.props.unsetLoader();
            console.log(err);
        })
    }

    uploadImage = (e) => {
        if (e.target.files)
            this.setState({
                file: e.target.files[0],
                fileText: e.target.files[0].name
            })
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name: this.state.name,
            email: this.state.email.toUpperCase(),
            currency: this.state.currency,
            language: this.state.language,
            timezone: this.state.timezone,
            profilePicture: this.state.s3URL,
            // id: getUserID(),
            // token: getUserProfile().token
        };
        console.log(this.state);
        await this.props.updateUserProfileRedux(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
        this.setState({ userProfile: data });

    }

    componentDidUpdate(prevState) {
        if (prevState.userProfile !== this.props.userProfile) {
            this.setState({ saveSuccess: true, saveFailed: false })
        }
    }

    render() {

        return (
            <React.Fragment>
                <Container>
                    <form name="profileForm" id="profileForm" onSubmit={this.onSubmit}>
                        <Row style={{ paddingTop: '3%' }}>
                            <Col sm={3}>
                                <center>
                                    <h2>Your account</h2>
                                    <img src={this.state.s3URL ? this.state.s3URL : this.state.getDefaultRedditProfilePicture} style={{ height: '100%', width: '100%', borderRadius: '500px', margin: "10px 0", boxShadow: '5px 10px 25px 1px #777' }} alt="profilephoto" />
                                    <Row style={{ marginTop: '10px' }}>
                                        <Col sm={9}>
                                            <input style={{ fontSize: '12px' }} className="form-control" type="file" name="profilepicture" accept="image/*" onChange={this.uploadImage} />
                                        </Col>
                                    </Row>
                                </center>
                            </Col>
                            <Col style={{ margin: '5rem' }}>
                                <Row>
                                    Your name
                                </Row>
                                <Row>
                                    <input type="text" className="form-control" onChange={(e) => this.setState({ name: e.target.value })} name="name" id="name" title="Please enter valid name" value={this.state.name} required />
                                </Row>
                                <Row>
                                    Your email address
                                </Row>
                                <Row>
                                    <input type="email" className="form-control" onChange={(e) => this.setState({ email: e.target.value })} name="email" title="Please enter valid email" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" value={this.state.email} required />
                                </Row>
                                <Row>
                                    <span>Location <span style={{ fontSize: '12px' }}>(City/State)</span></span>
                                </Row>
                                <Row>
                                    <input type="tel" className="form-control" onChange={(e) => this.setState({ location: e.target.value })} name="location" title="Please enter valid location" value={this.state.location} />
                                </Row>
                                <Row>
                                    Password
                                </Row>
                                <Row>
                                    <input type="password" className="form-control" onChange={(e) => this.setState({ description: e.target.value })} name="password" id="password" title="Please enter valid password" value={this.state.password} />
                                </Row>
                            </Col>
                            <Col style={{ marginTop: '5rem' }}>
                                <Row>
                                    Your gender
                                </Row>
                                <Row>
                                    <ButtonGroup toggle>
                                        {this.state.radios.map((radio, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                type="radio"
                                                variant={"light"}
                                                name="radio"
                                                value={radio.value}
                                                checked={this.state.gender === radio.value}
                                                onChange={(e) => this.setState({ gender: e.currentTarget.value })}
                                            >
                                                {radio.name}
                                            </ToggleButton>
                                        ))}
                                    </ButtonGroup>
                                </Row>
                                <Row>
                                    List of topics
                                </Row>
                                <Row>
                                    selector comes here
                                </Row>
                                <Row>
                                    selected bubbles come here
                                </Row>
                                <Row>
                                    Description
                                </Row>
                                <Row>
                                    <textarea type="text" className="form-control" onChange={(e) => this.setState({ description: e.target.value })} name="description" id="description" title="Please enter valid description" value={this.state.description} />
                                </Row>
                            </Col>
                            <div style={{ textAlign: 'center' }}>
                                <Button type="submit" style={{ margin: 'auto', backgroundColor: '#5bc5a7', borderColor: '#5bc5a7' }} >Save</Button><br />
                                {this.state.saveSuccess && <Alert style={{ width: '15rem', margin: 'auto', marginTop: '1rem' }} variant='success'>User Profile Updated.</Alert>}
                                {this.state.saveFailed && <Alert style={{ width: '15rem', margin: 'auto', marginTop: '1rem' }} variant='danger'>Error Occured.</Alert>}
                            </div>
                        </Row>
                    </form>
                </Container>
            </React.Fragment>
        );
    }
}


export default UserProfile;