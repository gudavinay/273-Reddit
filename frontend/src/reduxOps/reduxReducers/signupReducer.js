import { LOGOUT } from "../types";

const initialState = {
  user: {}
};

export default function redux(state = initialState, action) {
  switch (action.type) {
    // case SIGNUP:
    //   return { ...state, user: action.payload };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
