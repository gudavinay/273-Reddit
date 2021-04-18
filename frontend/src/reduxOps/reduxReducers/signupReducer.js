import { SIGNUP } from "../types";

const initialState = {
  user: {}
};

export default function redux(state = initialState, action) {
  switch (action.type) {
    case SIGNUP:
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
