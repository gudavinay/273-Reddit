import axios from "axios";
import backendServer from "../../webConfig";
import { COMMUNITY_SEARCH_OPTIONS, COMMUNITY_SEARCH_RESULTS_PROCESSING, COMMUNITY_SEARCH_RESULTS_COMPLETED } from "../types";

export const updateCommunitySearchOptions = ({
    query
}) => async dispatch => {
    try {
        dispatch({ type: COMMUNITY_SEARCH_OPTIONS, query });
        dispatch({ type: COMMUNITY_SEARCH_RESULTS_PROCESSING });
        const { data } = await axios.get(`${backendServer}/getAllCommunities?searchText=${query}`);
        dispatch({ type: COMMUNITY_SEARCH_RESULTS_COMPLETED, data });
    } catch (e) {
        console.log(e);
    }
};
