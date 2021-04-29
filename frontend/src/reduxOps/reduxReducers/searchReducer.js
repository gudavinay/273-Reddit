import { SEARCH_OPTIONS, SEARCH_RESULTS_PROCESSING, SEARCH_RESULTS_COMPLETED } from "../types";

const initialState = {
    query: "",
    processing: false,
    results: []
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_OPTIONS:
            return { ...state, query: action.query };
        case SEARCH_RESULTS_PROCESSING:
            return { ...state, processing: true };
        case SEARCH_RESULTS_COMPLETED:
            return { ...state, processing: false, results: action.data };
        default:
            return state;
    }
}
