import Axios from "axios";
import backendServer from "../../webConfig";
import { GETTOPIC, ERROR } from "../types";
export const signupRedux = data => async dispatch => {
  console.log(`${backendServer}/userRouter/signup`);
  await Axios.GET(`${backendServer}/community/signup`, data)
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
