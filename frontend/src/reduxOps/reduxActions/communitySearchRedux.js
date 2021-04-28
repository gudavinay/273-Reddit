import { COMMUNITY_SEARCH_OPTIONS } from "../types";

export const updateCommunitySearchOptions = ({
    query
}) => async dispatch => {
    dispatch({
        type: COMMUNITY_SEARCH_OPTIONS,
        query
    });    
};
