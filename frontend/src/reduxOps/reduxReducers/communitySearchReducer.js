import { COMMUNITY_SEARCH_OPTIONS } from "../types";

const initialState = {
    query: ""
};

export default function communitySearchReducer(state = initialState, action) {
    switch (action.type) {
        case COMMUNITY_SEARCH_OPTIONS:
            return { ...state, query: action.query };
        default:
            return state;
    }
}
