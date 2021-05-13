import { LOGIN, LOGOUT, SIGNUP, ERROR } from "../types";

const initialState = {
  user: {},
  error: ""
};

export default function redux(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload };
    case ERROR:
      return { ...state, user: action.payload, error: action.payload };
    case SIGNUP:
      return { ...state, user: action.payload };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
