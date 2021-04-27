import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import Home from "./Home/Home";
import Community from "./Home/Community/Community";
import CommunitySearch from "./Home/CommunitySearch/CommunitySearch";
import Dashboard from "./Home/Dashboard/Dashboard";
import CommunityAnalytics from "./Home/MyCommunities/CommunityAnalytics";
import MyCommunities from "./Home/MyCommunities/MyCommunities";
import MyCommunitiesModeration from "./Home/MyCommunities/MyCommunitiesModeration";
import CreateCommunity from "./Home/MyCommunities/CreateCommunity";
import UserProfile from "./Home/UserProfile/UserProfile";
import Messages from "./Home/Messages/Messages";
import NavigationBar from "./LandingPage/Navigationbar";
import { Fade } from "reactstrap";
import Error404 from "./Error404";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./globalStyles";
import { lightTheme, darkTheme } from "./Themes"
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false
    }
  }
  themeToggler = () => {
    this.state.darkMode ? this.setState({ darkMode: false }) : this.setState({ darkMode: true });
  }
  render() {
    return (<ThemeProvider theme={this.state.darkMode ? darkTheme : lightTheme}>
      <>
        <GlobalStyles />
        <Fade>
          {this.props.location.pathname !== "/" && <NavigationBar themeToggler={this.themeToggler} currentTheme={this.state.darkMode} />}
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Home} />
            <Route path="/community" component={Community} />
            <Route path="/communitysearch" component={CommunitySearch} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/community/communityanalytics" component={CommunityAnalytics} />
            <Route path="/mycommunities" component={MyCommunities} />
            <Route path="/createCommunity" component={CreateCommunity} />
            <Route path="/mycommunitiesmoderation" component={MyCommunitiesModeration} />
            <Route path="/userprofile" component={UserProfile} />
            <Route path="/messages" component={Messages} />
            <Route component={Error404} />
          </Switch>
        </Fade>
      </>
    </ThemeProvider>
    );
  }
}
export default withRouter(Main);
