import Axios from "axios";
import backendServer from "../../webConfig";
import { GETTOPIC, ERROR } from "../types";
export const getTopicFromDB = () => async dispatch => {
  const storageToken = JSON.parse(localStorage.getItem("userData"));
  console.log(storageToken.token);
  Axios.defaults.headers.common["authorization"] = storageToken.token;
  console.log(`${backendServer}/userRouter/signup`);
  await Axios.GET(`${backendServer}/community/getTopic`)
    .then(response => {
      dispatch({
        type: GETTOPIC,
        payload: response.data
      });
    })
    .catch(error => {
      dispatch({
        type: ERROR,
        payload: error
      });
    });
};
