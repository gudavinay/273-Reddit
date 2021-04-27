import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
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
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import NavigationBar from "./LandingPage/Navigationbar";
class Main extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <React.Fragment>
        {this.props.location.pathname !== "/login" &&
          this.props.location.pathname !== "/signup" && <NavigationBar />}
        {/* <NavigationBar /> */}
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/signUp" component={Signup} />
        <Route path="/home" component={Home} />
        <Route path="/community" component={Community} />
        <Route path="/communitysearch" component={CommunitySearch} />
        <Route path="/dashboard" component={Dashboard} />
        <Route
          path="/community/communityanalytics"
          component={CommunityAnalytics}
        />
        <Route path="/mycommunities" component={MyCommunities} />
        <Route path="/createCommunity" component={CreateCommunity} />
        <Route
          path="/mycommunitiesmoderation"
          component={MyCommunitiesModeration}
        />
        <Route path="/userprofile" component={UserProfile} />
        <Route path="/messages" component={Messages} />
      </React.Fragment>
    );
  }
}
export default withRouter(Main);
