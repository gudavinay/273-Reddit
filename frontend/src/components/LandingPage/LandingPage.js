import React, { Component } from 'react';
import { REDDIT } from '../../services/Constants';
import { Link } from "react-router-dom";

class LandingPage extends Component {

    render() {
        return (
            <React.Fragment>
                    {REDDIT}
                <div style={{margin:'auto'}}>
                    <Link to={"/home"} className="btn btn-primary">Go to post login page ( HOME )</Link>
                </div>
            </React.Fragment>
        )
    }
}

export default LandingPage;