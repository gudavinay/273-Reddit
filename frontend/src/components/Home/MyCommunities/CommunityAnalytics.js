import React, { Component } from "react";
import Plot from "react-plotly.js";
//import Plotly from "plotly.js";
import backendServer from "../../../webConfig";
import axios from "axios";
import { getMongoUserID, getToken } from "../../../services/ControllerUtils";
import { Row, Col, Container } from "react-bootstrap";
class CommunityAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityData: [],
      dataToPlot: [],
      layout: {
        height: 400,
        width: 500,
        title: "No of post v/s User per Community"
      }
    };
  }

  calculateValues(communityData) {
    let label = [];
    let yAxis = [];
    let yAxisUser = [];
    if (communityData.length > 0) {
      communityData.map(community => {
        label.push(community.communityName);
        yAxis.push(community.NoOfPost);
        yAxisUser.push(community.acceptedUsersSQLIds.length + 1);
      });
      console.log(yAxis);
    }
    this.setState({
      dataToPlot: [
        {
          y: yAxis,
          x: label,
          type: "bar",
          name: "Post"
        },
        {
          y: yAxisUser,
          x: label,
          type: "bar",
          name: "User"
        }
      ]
    });
    // this.setState({
    //   data: [
    //     {
    //       values: yAxis,
    //       labels: label,
    //       type: "pie"
    //     }
    //   ]
    // });
  }

  GetNoOfPostPerCommunity() {
    const ID = getMongoUserID();
    console.log(`${backendServer}/communityAnalytics?ID=${ID}`);
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(`${backendServer}/communityAnalytics?ID=${ID}`)
      .then(response => {
        if (response.status == 200) {
          this.setState({
            communityData: response.data
          });
          console.log(response.data);
          this.calculateValues(response.data);
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({
          error: "Community name is not unique"
        });
      });
  }

  componentDidMount() {
    this.GetNoOfPostPerCommunity();
  }

  render() {
    console.log(this.state.data);
    console.log(this.state.dataForUser);
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <Plot
                name="noOfPost"
                data={this.state.dataToPlot}
                layout={this.state.layout}
                onInitialized={figure => this.setState(figure)}
                onUpdate={figure => this.setState(figure)}
              />
            </Col>
            <Col>
              {/* <Plot
                name="noOfUser"
                data={this.state.dataForUser}
                layout={this.state.layoutUser}
                onInitialized={figure => this.setState(figure)}
                onUpdate={figure => this.setState(figure)}
              /> */}
            </Col>
          </Row>
        </Container>
        {/* <div style={{ width: "100%", height: "100%" }}></div> */}
        {/* <Plot
          data={[
            {
              x: [1, 2, 3, 4],
              y: { yAxis },
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" }
            },
            { type: "bar", x: [1, 2, 3, 4, 5, 6], y: { yAxis } }
          ]}
          layout={{ width: 500, height: 500, title: "A Fancy Plot" }}
        /> */}
      </React.Fragment>
    );
  }
}

export default CommunityAnalytics;
