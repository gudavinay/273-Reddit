import React, { Component } from 'react';
import { REDDIT } from '../../services/Constants';
import redditLogoSVG from '../../assets/redditLogo.svg';
import redditTextSVG from '../../assets/redditText.svg';

class LandingPage extends Component {

    render() {
        return (
            <React.Fragment>
                <div style={{margin:'auto'}}>
                    <img style={{ height: '50px', width: '50px' }} alt="Reddit Logo" src={redditLogoSVG} />
                    <img style={{ height: '50px', width: '50px' }} alt="Reddit Logo" src={redditTextSVG} />
                    {REDDIT}
                </div>
            </React.Fragment>
        )
    }
}

export default LandingPage;