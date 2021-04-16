import Axios from "axios";
import backendServer from '../../webConfig';
import { LOGIN, ERROR, LOGOUT } from "../types";
export const loginRedux = (data) => async dispatch => { 
    await Axios.post(`${backendServer}/login`, data)
        .then(response => {
            dispatch({
                type: LOGIN,
                payload: response.data
            })
        })
        .catch(error => {
            dispatch({
                type: ERROR,
                payload: error
            })
        });
}


export const logoutRedux = () => dispatch => dispatch({type: LOGOUT});