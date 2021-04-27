import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import errorSVG from '../assets/404.svg'

class Error404 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div style={{ textAlign: 'center' }}>
                    <img alt="" width="25%" src={errorSVG} />
                    <h1>Error <strong>404</strong></h1>
                    <Link to="/home"><h4>Home</h4></Link>
                </div>
            </React.Fragment>
        );
    }
}


export default Error404;