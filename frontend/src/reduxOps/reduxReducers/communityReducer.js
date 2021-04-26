import * as aType from "../types";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case aType.LOGOUT:
      return {};
    default:
      return state;
  }
}
