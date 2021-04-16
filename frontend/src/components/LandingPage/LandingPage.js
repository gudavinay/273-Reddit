import React, { Component } from 'react';
import { REDDIT } from '../../services/Constants'

class LandingPage extends Component {

    render() {
        return (
            <React.Fragment>
                {REDDIT}
            </React.Fragment>
        )
    }
}

export default LandingPage;