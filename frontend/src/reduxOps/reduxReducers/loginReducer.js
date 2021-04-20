import { LOGIN, LOGOUT } from "../types";

const initialState = {
  user: {},
  authFlag: false
};

export default function redux(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: action.payload, authFlag: true };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
