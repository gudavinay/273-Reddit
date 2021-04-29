import axios from "axios";
import backendServer from "../../webConfig";
import { SEARCH_OPTIONS, SEARCH_RESULTS_PROCESSING, SEARCH_RESULTS_COMPLETED } from "../types";

export const updateSearchOptions = ({
    query
}) => async dispatch => {
    try {
        dispatch({ type: SEARCH_OPTIONS, query });
        dispatch({ type: SEARCH_RESULTS_PROCESSING });
        const { data } = await axios.get(`${backendServer}/getAllCommunities?searchText=${query}`);
        dispatch({ type: SEARCH_RESULTS_COMPLETED, data });
    } catch (e) {
        console.log(e);
    }
};
