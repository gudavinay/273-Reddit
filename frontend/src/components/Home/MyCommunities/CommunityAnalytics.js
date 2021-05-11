import React, { Component } from "react";
import Plot from "react-plotly.js";
import backendServer from "../../../webConfig";
import axios from "axios";
import { getMongoUserID, getToken } from "../../../services/ControllerUtils";
class CommunityAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityData: [],
      data: [],
      layout: {
        height: 400,
        width: 500,
        title: "Number of Post Per Community"
      }
    };
  }

  calculateValues(communityData) {
    let label = [];
    let yAxis = [];
    if (communityData.length > 0) {
      communityData.map(community => {
        label.push(community.name);
        yAxis.push(community.count);
      });
      console.log(yAxis);
    }
    this.setState({
      data: [
        {
          values: yAxis,
          labels: label,
          type: "pie"
        }
      ]
    });
  }

  GetNoOfPostPerCommunity() {
    const ID = getMongoUserID();
    console.log(`${backendServer}/communityAnalystics?ID=${ID}`);
    axios.defaults.headers.common["authorization"] = getToken();
    axios
      .get(`${backendServer}/communityAnalystics?ID=${ID}`)
      .then(response => {
        if (response.status == 200) {
          this.setState({
            communityData: response.data
          });
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
    return (
      <React.Fragment>
        <div style={{ width: "100%", height: "100%" }}>
          <Plot
            data={this.state.data}
            layout={this.state.layout}
            onInitialized={figure => this.setState(figure)}
            onUpdate={figure => this.setState(figure)}
          />
        </div>
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
