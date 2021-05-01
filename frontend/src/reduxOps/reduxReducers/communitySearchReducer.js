import { COMMUNITY_SEARCH_OPTIONS, COMMUNITY_SEARCH_RESULTS_PROCESSING, COMMUNITY_SEARCH_RESULTS_COMPLETED } from "../types";

const initialState = {
    query: "",
    processing: false,
    results: []
};

export default function communitySearchReducer(state = initialState, action) {
    switch (action.type) {
        case COMMUNITY_SEARCH_OPTIONS:
            return { ...state, query: action.query };
        case COMMUNITY_SEARCH_RESULTS_PROCESSING:
            return { ...state, processing: true };
        case COMMUNITY_SEARCH_RESULTS_COMPLETED:
            return { ...state, processing: false, results: action.data };
        default:
            return state;
    }
}
