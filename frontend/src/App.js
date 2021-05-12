import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Main from "./components/Main.js";
import { Component } from "react";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
