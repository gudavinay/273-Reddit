import { LOGIN, LOGOUT, SIGNUP } from "../types";

const initialState = {
  user: {},
  authFlag: false
};

export default function redux(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload, authFlag: true };
    case SIGNUP:
      return { ...state, user: action.payload };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
